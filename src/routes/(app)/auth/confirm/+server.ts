import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;

	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as string;
	const next = url.searchParams.get('next') ?? '/';
	const code = url.searchParams.get('code') as string;

	if (token_hash && type) {
		console.log('TOKEN HASH AND TYPE FOUND');
		// @ts-ignore
		const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
		console.log('ERROR IS', error);
		console.log('REDIRECTING TO ', `/${next.slice(1)}`);
		console.log('EMAIL IS', data.user?.email);
		if (!error) {
			redirect(303, `/${next.slice(1)}`);
		}
	} else if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, `/${next.slice(1)}`);
		}
	}

	// return the user to an error page with some instructions
	redirect(303, '/auth/code-error');
};
