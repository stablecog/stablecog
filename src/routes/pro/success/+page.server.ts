import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { plan } = await parent();
	if (plan === 'FREE') {
		throw redirect(307, `/pro`);
	}
};
