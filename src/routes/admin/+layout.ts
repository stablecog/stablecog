import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	const { session } = await getSupabase(event);
	return { session };
};
