import {
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
} from '$env/static/public';
import { userSummary } from '$ts/stores/user/summary';
import { derived } from 'svelte/store';

const productIdToMaxOngoingGenerationsCountObject = {
	[PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION]: 2,
	[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]: 3,
	[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION]: 4
};

const baseCount = 1;

const productIdToMaxOngoingGenerationsCount = (productId: string | undefined) => {
	if (!productId) return baseCount;
	const count = productIdToMaxOngoingGenerationsCountObject[productId];
	if (!count) return baseCount;
	return count;
};

export const maxOngoingGenerationsCount = derived(userSummary, ($userSummary) => {
	const active_product_id = $userSummary?.product_id;
	return productIdToMaxOngoingGenerationsCount(active_product_id);
});
