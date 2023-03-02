import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';
import { writable } from 'svelte/store';

export const userSummary = writable<TUserSummary | undefined>(undefined);

export interface TUserSummary {
	total_remaining_credits: number;
	product_id?: TStripeSupportedProductIdSubscriptions;
	roles?: string[];
	free_credit_amount: number;
	renews_at?: string;
	cancels_at?: string;
}
