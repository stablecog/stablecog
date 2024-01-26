import { getRedirectTo } from '$routes/(app)/auth/getRedirectTo.js';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const rd_to = getRedirectTo(url.searchParams);

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, rd_to);
		}
	}

	// return the user to an error page with instructions
	redirect(303, '/auth/error/oauth');
};
