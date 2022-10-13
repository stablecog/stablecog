import { supabase } from '$ts/constants/supabase';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	if (supabase) {
		return { status: 'ok' };
	} else {
		throw error(404, 'Not found');
	}
};
