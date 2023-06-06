import type {
	TStripeSupportedPriceIdSubscriptionsMo,
	TStripeSupportedProductIdSubscriptions
} from '$ts/constants/stripePublic';
import { writable } from 'svelte/store';

export const userSummary = writable<TUserSummary | null>(null);

export interface TUserSummary {
	total_remaining_credits: number;
	product_id?: TStripeSupportedProductIdSubscriptions;
	price_id?: TStripeSupportedPriceIdSubscriptionsMo;
	roles?: string[];
	renews_at?: string;
	cancels_at?: string;
	more_credits_at?: string;
	free_credit_amount?: number;
	has_nonfree_credits?: boolean;
	wants_email?: boolean;
}
