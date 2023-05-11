import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (!session?.user?.id) {
		throw redirect(307, `/sign-in?redirect_to=${encodeURIComponent(event.url.pathname)}`);
	}
	const confirm_other_email = event.url.searchParams.get('confirm_other_email');
	return {
		confirm_other_email
	};
};
