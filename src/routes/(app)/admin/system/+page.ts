import { getSystemStatus } from '$routes/(app)/admin/system/helpers.js';

interface TParent {
	session: Session | null | undefined;
}

export const load = async ({ parent }) => {
	const { session } = (await parent()) as TParent;
	if (!session) throw new Error('Unauthorized');
	const res = await getSystemStatus(session.access_token);
	return {
		systemStatus: res
	};
};
