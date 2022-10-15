import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TDBGenerationRealtimePayload } from '$ts/types/main';
import type { RealtimeChannel } from '@supabase/supabase-js';

export async function GET() {
	if (supabaseAdmin !== undefined) {
		let channel: RealtimeChannel | undefined;
		const readable = new ReadableStream({
			start(ctr) {
				console.log('Started Stream:', new Date().toUTCString());
				if (supabaseAdmin) {
					channel = supabaseAdmin
						.channel('generation')
						.on(
							'postgres_changes',
							{ event: '*', schema: 'public', table: 'generation' },
							(payload) => {
								const eventType = payload.eventType;
								const newObj = payload.new as TDBGenerationRealtimePayload;
								const newData: TDBGenerationRealtimePayload = {
									id: newObj.id,
									status: newObj.status,
									country_code: newObj.country_code,
									duration_ms: newObj.duration_ms,
									created_at: newObj.created_at,
									updated_at: newObj.updated_at
								};
								if (eventType === 'INSERT' || eventType === 'UPDATE') {
									ctr.enqueue(`data: ${JSON.stringify(newData)}\n\n`);
								}
							}
						)
						.subscribe();
				}
			},
			cancel() {
				console.log('Cancelled Stream:', new Date().toUTCString());
				channel?.unsubscribe();
				supabaseAdmin?.removeAllChannels();
			}
		});

		return new Response(readable, {
			headers: {
				'content-type': 'text/event-stream'
			}
		});
	} else {
		return new Response('Not found', {
			status: 404
		});
	}
}
