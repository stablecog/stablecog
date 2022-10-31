import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { supabase } from '$ts/constants/supabase';
import { error } from '@sveltejs/kit';

export const prerender = false;
export const load: LayoutServerLoad = async (event) => {
	if (!supabase) throw error(500, 'Supabase not configured');
	return {
		session: await getServerSession(event)
	};
};
