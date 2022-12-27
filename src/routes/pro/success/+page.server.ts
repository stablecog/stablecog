import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { tier } = await parent();
	if (tier === 'FREE') {
		throw redirect(307, `/pro`);
	}
};
