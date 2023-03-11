import { apiUrl } from '$ts/constants/main';

const perPage = 50;

export async function getAllUsers({
	cursor,
	search,
	access_token
}: {
	cursor?: string;
	search?: string;
	access_token?: string;
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
	product_id?: string;
}

export interface TUserCredit {
	remaining_amount: number;
	expires_at: string;
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
