import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals: { locale } }) => {
	return {
		locale,
		session: null
	};
};
