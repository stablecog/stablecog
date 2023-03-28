import { apiUrl } from '$ts/constants/main';
import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';

const perPage = 50;

export async function getAllUsers({
	cursor,
	search,
	access_token,
	active_product_id
}: {
	cursor?: string;
	search?: string;
	access_token?: string;
	active_product_id?: TStripeSupportedProductIdSubscriptions;
}) {
	console.log('getAllUsers');
	const query = new URLSearchParams();
	query.append('per_page', perPage.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	if (search) {
		query.append('search', search);
	}
	if (active_product_id !== undefined && active_product_id) {
		query.append('active_product_ids', active_product_id);
	}
	const url = `${apiUrl.origin}/v1/admin/users?${query.toString()}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	const resJson: TAllUsersPage = await res.json();
	return resJson;
}

export interface TAllUsersPage {
	users: TUserForAdmin[];
	total_count?: number;
	total_count_by_product_id?: {
		[productId: string]: number;
	};
	next?: string;
}

export interface TUserForAdmin {
	id: string;
	email: string;
	stripe_customer_id: string;
	credits?: TUserCredit[];
	created_at: string;
	last_sign_in_at: string;
	last_seen_at: string;
	product_id?: string;
}

export interface TUserCredit {
	remaining_amount: number;
	expires_at: string;
	replenished_at?: string;
	credits: TUserCredit[];
}

export interface TUserCredit {
	expires_at: string;
	credit_type: TUserCreditType;
	remaining_amount: number;
}

export interface TUserCreditType {
	name: string;
	stripe_product_id?: string;
}
