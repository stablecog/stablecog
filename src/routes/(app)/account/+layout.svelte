<script lang="ts">
	import { page } from '$app/stores';
	import PageNavbar from '$components/navigation/pageNavbar/PageNavbar.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TAccountRoute } from '$approutes/account/types';

	let accountRoutes: TAccountRoute[];
	$: accountRoutes = [
		{
			name: $LL.Account.Tabs.Account(),
			href: '/account',
			icon: 'account',
			strictMatch: true
		},
		{
			name: $LL.Account.Tabs.Usage(),
			href: '/account/usage',
			icon: 'usage'
		},
		{
			name: $LL.Account.Tabs.APIKeys(),
			href: '/account/api-keys',
			icon: 'api-keys'
		}
	];

	$: isNavbarRoute = accountRoutes.some((route) => {
		if (route.strictMatch) {
			return $page.url.pathname === route.href;
		}
		return $page.url.pathname.startsWith(route.href);
	});
</script>

{#if isNavbarRoute}
	<div class="w-full flex justify-center pt-2 md:pt-10">
		<div class="w-full max-w-4xl flex flex-col">
			<PageNavbar items={accountRoutes} />
		</div>
	</div>
{/if}
<slot />
