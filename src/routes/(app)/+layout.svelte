<script lang="ts">
	import { page } from '$app/stores';
	import LayoutWrapper from '$components/wrappers/LayoutWrapper.svelte';
	import UnderDevelopment from '$components/system/UnderDevelopment.svelte';
	import UpdateAvailableCard from '$components/cards/UpdateAvailableCard.svelte';
	import GenerationWorker from '$components/appLayout/GenerationWorker.svelte';
	import SSEConnector from '$components/appLayout/SSEConnector.svelte';
	import UpscaleWorker from '$components/appLayout/UpscaleWorker.svelte';
	import Drawer from '$components/navigation/Drawer.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/navbar/Navbar.svelte';
	import UserSummaryProvider from '$components/userSummary/UserSummaryProvider.svelte';
	import { appRoutes, rawRoutes, routesWithTheirOwnDrawer } from '$ts/constants/routes';
	import { underDevelopment } from '$ts/constants/underDevelopment';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { appVersion, serverVersion } from '$ts/stores/appVersion';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { userSummary } from '$ts/stores/user/summary';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	export let data;

	$: isDrawerRoute =
		!routesWithTheirOwnDrawer.includes($page.url.pathname) &&
		!routesWithTheirOwnDrawer.some((r) => $page.url.pathname.startsWith(r));

	$: showUpdateAvailableCard =
		Number($serverVersion) > Number($appVersion) &&
		!rawRoutes.includes($page.url.pathname) &&
		(!$userSummary || !isSuperAdmin($userSummary.roles)) &&
		!$page.url.pathname.startsWith('/admin') &&
		!$page.url.pathname.startsWith('/auth') &&
		!$page.url.pathname.startsWith('/sign-in');

	$: showUnderDevelopmentCard =
		underDevelopment &&
		!rawRoutes.includes($page.url.pathname) &&
		(!$userSummary || !isSuperAdmin($userSummary.roles)) &&
		!$page.url.pathname.startsWith('/admin') &&
		!$page.url.pathname.startsWith('/auth') &&
		!$page.url.pathname.startsWith('/sign-in');

	const hideFooterRoutes = ['/admin/logs'];
</script>

<QueryClientProvider client={data.queryClient}>
	<UserSummaryProvider queryClient={data.queryClient}>
		<SSEConnector>
			<GenerationWorker>
				<UpscaleWorker>
					<LayoutWrapper isAppRoute={appRoutes.includes($page.url.pathname)}>
						{#if showUpdateAvailableCard}
							<div class="my-auto flex w-full flex-1 flex-col items-center justify-center py-4">
								<UpdateAvailableCard />
							</div>
						{:else if showUnderDevelopmentCard}
							<UnderDevelopment />
						{:else}
							<Navbar />
							{#if appRoutes.includes($page.url.pathname)}
								<slot />
							{:else}
								{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
									<div
										style={$navbarHeight ? `height: ${$navbarHeight}px` : ``}
										class="h-16 w-full md:h-18"
									/>
								{/if}
								<main class="relative flex w-full flex-1 flex-col break-words">
									<slot />
								</main>
								{#if !hideFooterRoutes.includes($page.url.pathname)}
									<Footer />
								{/if}
							{/if}
						{/if}
					</LayoutWrapper>
					{#if !rawRoutes.includes($page.url.pathname) && isDrawerRoute}
						<Drawer />
					{/if}
				</UpscaleWorker>
			</GenerationWorker>
		</SSEConnector>
	</UserSummaryProvider>
</QueryClientProvider>
