import { supabaseClient } from '$ts/constants/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, type Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	if (!supabaseClient) {
		throw error(500, 'Supabase not configured');
	}
	const { session } = await getSupabase(event);
	const { data, error: err } = await supabaseClient.from('admin').select('id');
	const admins = data?.map((a) => a.id);
	return { session, admins };
};
