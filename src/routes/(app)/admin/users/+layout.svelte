<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';

	$: isUserSuperAdmin = isSuperAdmin($userSummary?.roles);

	$: [isUserSuperAdmin, $userSummary], redirect();
	function redirect() {
		if (!browser) return;
		if (isUserSuperAdmin) return;
		if ($userSummary && $sessionStore) {
			goto('/');
			return;
		}
		const route = `/sign-in?rd_to=${encodeURIComponent($page.url.pathname)}`;
		goto(route);
	}
</script>

<slot />
