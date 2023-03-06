import { eurCountryCodes } from '$ts/constants/main';
import type { TStripeSupportedCurrency } from '$ts/constants/stripePublic';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const countryCode = event.locals.countryCode;
	const currency: TStripeSupportedCurrency =
		countryCode && eurCountryCodes.includes(countryCode) ? 'eur' : 'usd';
	return {
		currency
	};
};
