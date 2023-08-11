import { apiUrl } from '$ts/constants/main';
import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';

const perPage = 50;
interface TCount {
	product_id: string;
	count: number;
}

export async function getAllUsers({
	cursor,
	search,
	access_token,
	active_product_id,
	banned
}: {
	cursor?: string;
	search?: string;
	access_token?: string;
	active_product_id?: TStripeSupportedProductIdSubscriptions;
	banned?: boolean;
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
	if (banned !== undefined) {
		query.append('banned', banned.toString());
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
	const { total_count, total_count_by_product_id } = resJson;
	let total_counts: TCount[] | undefined;
	if (total_count !== undefined && total_count_by_product_id !== undefined) {
		let withProductIdTotal = 0;
		let withProductId: TCount[] = [];
		for (const productId in total_count_by_product_id) {
			withProductIdTotal += total_count_by_product_id[productId];
			withProductId.push({
				product_id: productId,
				count: total_count_by_product_id[productId]
			});
		}
		const freeCount = total_count - withProductIdTotal;
		total_counts = [{ product_id: 'free', count: freeCount }, ...withProductId];
	}
	return { ...resJson, total_counts };
}

export async function banOrUnbanUsers({
	user_ids,
	access_token,
	action
}: {
	user_ids: string[];
	access_token: string;
	action: 'ban' | 'unban';
}) {
	const url = `${apiUrl.origin}/v1/admin/users/ban`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			user_ids,
			action
		})
	});
	const resJson = await res.json();
	return resJson;
}

export async function banOrUnbanDomains({
	domains,
	access_token,
	action
}: {
	domains: string[];
	access_token: string;
	action: 'ban' | 'unban';
}) {
	const url = `${apiUrl.origin}/v1/admin/domains/ban`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			domains,
			action
		})
	});
	const resJson = await res.json();
	return resJson;
}

export interface TAllUsersPage {
	users: TUserForAdmin[];
	total_counts?: TCount[] | undefined;
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
	banned_at?: string;
	scheduled_for_deletion_on?: string;
	data_deleted_at?: string;
	username: string;
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
