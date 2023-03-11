const superAdminRole = 'SUPER_ADMIN';
const galleryAdminRole = 'GALLERY_ADMIN';

export const galleryAdminAllowedRoutes = ['/admin', '/admin/gallery'];

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

export const isGalleryAdmin = (roles: string | string[] | undefined) => {
	if (!roles) {
		return false;
	} else if (typeof roles === 'string') {
		return roles === galleryAdminRole;
	} else if (roles instanceof Array) {
		return roles.includes(galleryAdminRole);
	}
	return false;
};
