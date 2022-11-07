import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import { supabaseClient } from '$ts/constants/supabaseClient';

export const prerender = false;
export const load: LayoutServerLoad = async (event) => {
	if (!supabaseClient) {
		throw error(500, 'Supabase not configured');
	}
	const { data, error: err } = await supabaseClient.from('admin').select('id');
	const admins = data?.map((a) => a.id);
	return {
		session: await getServerSession(event),
		admins
	};
};
