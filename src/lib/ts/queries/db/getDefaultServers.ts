import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { TDBServer } from '$ts/types/db';
import type { PostgrestError } from '@supabase/supabase-js';

export async function getDefaultServers() {
	if (supabaseAdmin) {
		const { data, error }: TRes = await supabaseAdmin
			.from('server')
			.select('*')
			.filter('enabled', 'eq', true);
		if (error) {
			console.log(error);
		}
		if (data) {
			return data;
		} else {
			return [];
		}
	} else {
		return [];
	}
}

interface TRes {
	data: TDBServer[] | null;
	error: PostgrestError | null;
}
