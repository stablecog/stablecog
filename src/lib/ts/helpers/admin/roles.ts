const superAdminRole = 'SUPER_ADMIN';

export const isSuperAdmin = (roles: string | string[] | undefined) => {
	if (!roles) {
		return false;
	} else if (typeof roles === 'string') {
		return roles === superAdminRole;
	} else if (roles instanceof Array) {
		return roles.includes(superAdminRole);
	}
	return false;
};
