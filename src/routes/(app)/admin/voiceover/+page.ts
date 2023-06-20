import { redirect } from '@sveltejs/kit';

export const load = async () => {
	throw redirect(302, '/admin/voiceover/generate');
};
