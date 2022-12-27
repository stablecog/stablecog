import { STRIPE_PRO_PRICE_ID } from '$env/static/private';
import { stripe } from '$ts/constants/stripe';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const availableProReasons = [
	'width',
	'height',
	'dimensions',
	'steps',
	'model',
	'scheduler',
	'upscale',
	'width_generation',
	'height_generation',
	'dimensions_generation',
	'steps_generation',
	'model_generation',
	'scheduler_generation'
] as const;
export type TAvailableProReason = typeof availableProReasons[number];

export const load: PageServerLoad = async ({ url }) => {
	try {
		const res = await stripe.prices.retrieve(STRIPE_PRO_PRICE_ID);
		if (res.unit_amount === null || res.unit_amount === undefined) {
			throw error(500, 'Error loading prices');
		}
		let _reason = url.searchParams.get('reason');
		const reason: TAvailableProReason | null =
			_reason && availableProReasons.includes(_reason as TAvailableProReason)
				? (_reason as TAvailableProReason)
				: null;
		return {
			reason,
			prices: {
				pro: res.unit_amount
			}
		};
	} catch (err) {
		throw error(500, 'Error loading prices');
	}
};
