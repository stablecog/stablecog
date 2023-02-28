const superAdminRole = 'SUPER_ADMIN';

export const isSuperAdmin = (roles: string | string[]) => {
	if (roles instanceof Array) {
		return roles.includes(superAdminRole);
	} else if (typeof roles === 'string') {
		return roles === superAdminRole;
	}
	return false;
};
