import {
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
} from '$env/static/public';
import { userSummary } from '$ts/stores/user/summary';
import { derived } from 'svelte/store';

const productIdToMaxOngoingGenerationOutputsCountObject = {
	[PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION]: 8,
	[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]: 16,
	[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION]: 24
};

const baseCount = 4;

const productIdToMaxOngoingGenerationsCount = (productId: string | undefined) => {
	if (!productId) return baseCount;
	const count = productIdToMaxOngoingGenerationOutputsCountObject[productId];
	if (!count) return baseCount;
	return count;
};

export const maxOngoingGenerationOutputsCount = derived(userSummary, ($userSummary) => {
	const active_product_id = $userSummary?.product_id;
	return productIdToMaxOngoingGenerationsCount(active_product_id);
});
