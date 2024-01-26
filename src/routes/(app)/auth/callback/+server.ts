import { isAllowedRedirectRoute } from '$ts/constants/main.js';
import { redirect } from '@sveltejs/kit';

const defaultRedirectRoute = '/generate';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const rd_to = url.searchParams.get('rd_to') ?? defaultRedirectRoute;
	const rd_to_string = decodeURIComponent(rd_to);

	const final_rd = isAllowedRedirectRoute(rd_to_string) ? rd_to_string : defaultRedirectRoute;

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, `/${final_rd}`);
		}
	}

	// return the user to an error page with instructions
	redirect(303, '/auth/error/oauth');
};
