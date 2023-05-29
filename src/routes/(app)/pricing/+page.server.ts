import { eurCountryCodes } from '$ts/constants/main';
import type { TStripeSupportedCurrency } from '$ts/constants/stripePublic';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const countryCode = locals.countryCode;
	const currency: TStripeSupportedCurrency =
		countryCode && eurCountryCodes.includes(countryCode) ? 'eur' : 'usd';
	return {
		currency
	};
};
