import type {
	TStripeSupportedPriceIdSubscriptionsMo,
	TStripeSupportedProductIdSubscriptions
} from '$ts/constants/stripePublic';
import type {
	QueryObserverResult,
	RefetchOptions,
	RefetchQueryFilters
} from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

export const userSummary = writable<TUserSummary | null>(null);

export interface TUserSummary {
	total_remaining_credits: number;
	product_id?: TStripeSupportedProductIdSubscriptions;
	price_id?: TStripeSupportedPriceIdSubscriptionsMo;
	roles?: string[];
	renews_at?: string;
	renews_at_credit_amount?: number;
	more_credits_at?: string;
	more_credits_at_credit_amount?: number;
	more_free_credits_at?: string;
	more_free_credits_at_credit_amount?: number;
	cancels_at?: string;
	free_credit_amount?: number;
	has_nonfree_credits?: boolean;
	wants_email?: boolean;
	username: string;
	has_purchase?: boolean;
	username_changed_at?: string;
	scheduled_for_deletion_on?: string;
	refetch?: (
		options?: (RefetchOptions & RefetchQueryFilters) | undefined
	) => Promise<QueryObserverResult<TUserSummary | null, unknown>>;
}
