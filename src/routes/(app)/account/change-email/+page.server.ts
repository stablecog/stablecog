import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user?.id) {
		redirect(307, `/sign-in?rd_to=${encodeURIComponent(event.url.pathname)}`);
	}
	const confirm_other_email = event.url.searchParams.get('confirm_other_email');
	return {
		confirm_other_email
	};
};
