import type { RequestHandler } from '@sveltejs/kit';
import { extractOpenaiChatInputs, postToOpenAI, chatCompletionPayload, ApiChatResponse } from '$routes/api/openai/chat';

import type { OpenAIAPI } from '$routes/chatgpt/types/api-openai';

export const POST : RequestHandler = async ({ request }) => {
  try {
    const { api, ...rest } = await extractOpenaiChatInputs(request);
    console.log('[abcdefg]');
    const response = await postToOpenAI(api, '/v1/chat/completions', chatCompletionPayload(rest, false));
    const completion: OpenAIAPI.Chat.CompletionsResponse = await response.json();
    // return new NextResponse(JSON.stringify({
    //   message: completion.choices[0].message,
    // } as ApiChatResponse));
    return new Response(JSON.stringify({
      message: completion.choices[0].message,
    } as ApiChatResponse));
  } catch (error: any) {
    console.error('Fetch request failed:', error);
    // return new NextResponse(`[Issue] ${error}`, { status: 400 });
    return new Response(`[Issue] ${error}`, { status: 400 });
  }
}