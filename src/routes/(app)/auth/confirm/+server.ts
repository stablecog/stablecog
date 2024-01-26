import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (token_hash && type) {
		// @ts-ignore
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (!error) {
			redirect(303, `/${next.slice(1)}`);
		}
	}

	// return the user to an error page with some instructions
	redirect(303, '/auth/code-error');
};
