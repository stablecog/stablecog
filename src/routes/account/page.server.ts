import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (!session?.user?.id) {
		throw redirect(307, `/login?redirect_to=${encodeURIComponent(event.url.pathname)}`);
	}
};
