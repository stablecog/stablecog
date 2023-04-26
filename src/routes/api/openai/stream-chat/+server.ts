import type { RequestHandler } from '@sveltejs/kit';
import { chatStreamRepeater } from '$routes/api/openai/stream-chat';
import { extractOpenaiChatInputs } from '../chat';

export const POST : RequestHandler = async ({ request }) => {
  try {
    const apiChatInput = await extractOpenaiChatInputs(request);
    const stream: ReadableStream = await chatStreamRepeater(apiChatInput, request.signal);
    return new Response(stream);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Fetch request aborted in handler');
      return new Response('Request aborted by the user.', { status: 499 }); // Use 499 status code for client closed request
    } else if (error.code === 'ECONNRESET') {
      console.log('Connection reset by the client in handler');
      return new Response('Connection reset by the client.', { status: 499 }); // Use 499 status code for client closed request
    } else {
      console.error('Fetch request failed:', error);
      return new Response(`[Issue] ${error}`, { status: 400 });
    }
  }
}