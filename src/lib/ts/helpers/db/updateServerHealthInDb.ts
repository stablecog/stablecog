import { supabaseAdmin } from '$ts/constants/supabaseAdmin';

export async function updateServerHealthInDb(serverUrl: string, healthy: boolean) {
	if (supabaseAdmin) {
		const { data, error } = await supabaseAdmin
			.from('server')
			.update({ healthy, last_health_check_at: new Date().toISOString() })
			.eq('url', serverUrl)
			.select('url')
			.single();
		if (error) {
			console.log(error);
		} else if (data) {
			console.log(
				'---- Updated server health in DB for:',
				data.url,
				'---- Healthy:',
				healthy,
				'----'
			);
		}
	}
}
