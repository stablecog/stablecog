<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import { userSummary } from '$ts/stores/user/summary';

	$: isUserGalleryAdmin = isGalleryAdmin($userSummary?.roles);
	$: isUserSuperAdmin = isSuperAdmin($userSummary?.roles);

	$: [isUserGalleryAdmin, isUserSuperAdmin, $userSummary], redirect();
	function redirect() {
		if (!browser) return;
		if (isUserGalleryAdmin) return;
		if (isUserSuperAdmin) return;
		if ($userSummary && $page.data.session) {
			goto('/');
			return;
		}
		const route = `/sign-in?rd_to=${encodeURIComponent($page.url.pathname)}`;
		goto(route);
	}
</script>

<slot />
