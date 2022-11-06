import { supabaseClient } from '$ts/constants/supabaseClient';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// protect requests to all routes that start with /admin (except login)
	if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
		if (!supabaseClient || !supabaseAdmin) return Response.redirect(`${event.url.origin}/`, 303);
		const { session, supabaseClient: _supabaseClient } = await getSupabase(event);
		const userId = session?.user?.id;
		const { data, error } = await _supabaseClient.from('admin').select('id');
		const admins = data?.map((a) => a.id);
		if (data && !error && admins && admins.includes(userId)) {
			console.log('Admin user access:', userId);
		} else {
			console.log('Non-admin user access:', userId);
			return Response.redirect(`${event.url.origin}/admin/login`, 303);
		}
	}
	return resolve(event);
};
