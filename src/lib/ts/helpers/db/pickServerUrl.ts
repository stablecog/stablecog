import { env as envPublic } from '$env/dynamic/public';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TDBServer } from '$ts/types/db';
import type { PostgrestError } from '@supabase/supabase-js';

export async function pickServerUrl(serverUrl: string): Promise<TPickServerUrlRes> {
	if (
		envPublic.PUBLIC_DEFAULT_SERVER_URL === undefined ||
		serverUrl !== envPublic.PUBLIC_DEFAULT_SERVER_URL
	) {
		return { serverUrl: serverUrl, isDefault: false };
	}
	if (!supabaseAdmin) {
		return { serverUrl: serverUrl, isDefault: false };
	}
	const { data, error }: { data: TDBServer[] | null; error: PostgrestError | null } =
		await supabaseAdmin.from('server').select('*').filter('healthy', 'eq', true);
	if (!data || data.length < 1 || error) {
		if (error) console.log(error);
		return { serverUrl: serverUrl, isDefault: false };
	}
	const pickedServer = data[Math.floor(Math.random() * data.length)];
	console.log('---- Picked server url is:', pickedServer.url);
	return { serverUrl: pickedServer.url, isDefault: true };
}

export interface TPickServerUrlRes {
	serverUrl: string;
	isDefault: boolean;
}
