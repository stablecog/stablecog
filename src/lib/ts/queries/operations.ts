import { apiUrl } from '$ts/constants/main';
import type { TOperationSource, TOperationType } from '$ts/helpers/user/operations';

const operationsPerPage = 50;

export async function getUserOperations({
	cursor,
	access_token
}: {
	cursor?: string;
	access_token: string;
}) {
	const query = new URLSearchParams();
	query.append('per_page', operationsPerPage.toString());
	if (cursor) {
		query.append('cursor', cursor.toString());
	}
	const url = `${apiUrl.origin}/v1/user/operations?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	const data: TUserOperationsPage = await res.json();
	const extendedOperations: TUserOperationExtended[] = data.operations.map((operation) => {
		const createdAt = new Date(operation.created_at);
		const completedAt = new Date(operation.completed_at);
		const duration_sec = (completedAt.getTime() - createdAt.getTime()) / 1000;
		return {
			...operation,
			duration_sec
		};
	});
	const editedPage: TUserOperationsPageExtended = {
		...data,
		operations: extendedOperations
	};
	return editedPage;
}

export interface TUserOperationsPage {
	operations: TUserOperation[];
	next?: string;
}

export interface TUserOperationsPageExtended extends TUserOperationsPage {
	operations: TUserOperationExtended[];
}

export interface TUserOperation {
	id: string;
	operation_type: TOperationType;
	created_at: string;
	started_at: string;
	completed_at: string;
	num_outputs: number;
	source: TOperationSource;
	cost: number;
}

export interface TUserOperationExtended extends TUserOperation {
	duration_sec: number;
}
