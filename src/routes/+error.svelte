<script lang="ts">
	import { page } from '$app/stores';
	import Drawer from '$components/navigation/Drawer.svelte';
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/navbar/Navbar.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LayoutWrapper from '$components/wrappers/LayoutWrapper.svelte';
	import '$css/app.css';
	import LL from '$i18n/i18n-svelte';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { metaDescriptionDefault } from '$ts/constants/meta';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { rawRoutes } from '$ts/constants/routes';
	import { navbarStickyType } from '$ts/stores/navbar';
	import { navbarHeight } from '$ts/stores/navbarHeight';
</script>

<MetaTag
	title="Error | Stablecog"
	description={metaDescriptionDefault}
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
	robots="noindex"
/>

<LayoutWrapper>
	<Navbar />
	{#if !rawRoutes.includes($page.url.pathname) && ($navbarStickyType === undefined || $navbarStickyType !== 'relative')}
		<div style={$navbarHeight ? `height: ${$navbarHeight}px` : ``} class="h-16 w-full md:h-18" />
	{/if}
	<div
		class="flex w-full flex-1 flex-col items-center justify-center px-5 pb-[calc(4vh+1.5rem)] pt-8"
	>
		<div class="flex w-full max-w-lg flex-col items-center justify-center gap-8">
			<div class="flex w-full max-w-xl flex-col items-center gap-3">
				<h1 class="text-7xl font-bold md:text-8xl">{$page.status}</h1>
				<p class="text-lg text-c-on-bg/60">
					{$page.status === 404
						? $LL.Error.NotFound()
						: $page.error
							? $page.error.message
							: $LL.Error.SomethingWentWrong()}
				</p>
			</div>
			<Button class="w-56 max-w-full" href="/generate">{$LL.Shared.GoHomeButton()}</Button>
		</div>
	</div>
	<Footer />
	<Drawer />
</LayoutWrapper>
