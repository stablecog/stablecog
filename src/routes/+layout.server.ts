import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const prerender = false;
export const load: LayoutServerLoad = async (event) => {
	const locale = event.locals.locale;
	return {
		locale,
		session: await getServerSession(event)
	};
};
