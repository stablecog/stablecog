import { isAdmin } from '$ts/helpers/admin/roles';
import type { TUserSummary } from '$ts/stores/user/summary';

export const canUserEditNumOutputs = (userSummary: TUserSummary | null) => {
	if (!userSummary) {
		return false;
	}
	return (
		userSummary.product_id !== undefined ||
		userSummary.has_nonfree_credits === true ||
		isAdmin(userSummary.roles)
	);
};
