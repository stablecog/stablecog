import type { TStripeSupportedProductId } from '$ts/constants/stripePublic';
import { writable } from 'svelte/store';

export const userSummary = writable<TUserSummary | undefined>(undefined);

export interface TUserSummary {
	total_remaining_credits: number;
	product_id?: TStripeSupportedProductId;
	roles?: string[];
}
