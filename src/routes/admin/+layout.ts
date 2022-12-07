import { supabase } from '$ts/constants/supabase';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, type Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	if (!supabase) {
		throw error(500, 'Supabase not configured');
	}
	const { session } = await getSupabase(event);
	return { session };
};
