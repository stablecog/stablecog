<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { userSummary } from '$ts/stores/user/summary';

	$: isUserSuperAdmin = isSuperAdmin($userSummary?.roles);

	$: [isUserSuperAdmin, $userSummary], redirectToSignIn();
	function redirectToSignIn() {
		if (!browser) return;
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
