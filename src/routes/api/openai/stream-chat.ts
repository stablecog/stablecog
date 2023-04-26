import { createParser } from 'eventsource-parser';

import { ApiChatInput, chatCompletionPayload, extractOpenaiChatInputs, postToOpenAI } from './chat';
import { OpenAIAPI } from '$routes/chatgpt/types/api-openai';


export async function chatStreamRepeater(input: ApiChatInput, signal: AbortSignal): Promise<ReadableStream> {

  // Handle the abort event when the connection is closed by the client
  signal.addEventListener('abort', () => {
    console.log('Client closed the connection.');
  });

  // begin event streaming from the OpenAI API
  const encoder = new TextEncoder();

  let upstreamResponse: Response;
  try {
    upstreamResponse = await postToOpenAI(input.api, '/v1/chat/completions', chatCompletionPayload(input, true), signal);
  } catch (error: any) {
    console.log(error);
    const message = '[OpenAI Issue] ' + (error?.message || typeof error === 'string' ? error : JSON.stringify(error)) + (error?.cause ? ' · ' + error.cause : '');
    return new ReadableStream({
      start: controller => {
        controller.enqueue(encoder.encode(message));
        controller.close();
      },
    });
  }

  // decoding and re-encoding loop

  const onReadableStreamStart = async (controller: ReadableStreamDefaultController) => {

    let hasBegun = false;

    // stream response (SSE) from OpenAI is split into multiple chunks. this function
    // will parse the event into a text stream, and re-emit it to the client
    const upstreamParser = createParser(event => {

      // ignore reconnect interval
      if (event.type !== 'event')
        return;

      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (event.data === '[DONE]') {
        controller.close();
        return;
      }

      try {
        const json: OpenAIAPI.Chat.CompletionsResponseChunked = JSON.parse(event.data);

        // ignore any 'role' delta update
        if (json.choices[0].delta?.role)
          return;

        // stringify and send the first packet as a JSON object
        if (!hasBegun) {
          hasBegun = true;
          const firstPacket: ApiChatFirstOutput = {
            model: json.model,
          };
          controller.enqueue(encoder.encode(JSON.stringify(firstPacket)));
        }

        // transmit the text stream
        const text = json.choices[0].delta?.content || '';
        controller.enqueue(encoder.encode(text));

      } catch (error) {
        // maybe parse error
        console.error('Error parsing OpenAI response', error);
        controller.error(error);
      }
    });

    // https://web.dev/streams/#asynchronous-iteration
    const decoder = new TextDecoder();
    for await (const upstreamChunk of upstreamResponse.body as any)
      upstreamParser.feed(decoder.decode(upstreamChunk, { stream: true }));

  };

  return new ReadableStream({
    start: onReadableStreamStart,
    cancel: (reason) => console.log('chatStreamRepeater cancelled', reason),
  });
}


/**
 * The client will be sent a stream of words. As an extra (an totally optional) 'data channel' we send a
 * string JSON object with the few initial variables. We hope in the future to adopt a better
 * solution (e.g. websockets, but that will exclude deployment in Edge Functions).
 */
export interface ApiChatFirstOutput {
  model: string;
}

//noinspection JSUnusedGlobalSymbols
export const config = {
  runtime: 'edge',
};