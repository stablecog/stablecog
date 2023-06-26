<script>
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';

	import { clickoutside } from '$ts/actions/clickoutside';
	import { isDrawerOpen } from '$ts/stores/isDrawerOpen';
	import { windowHeight } from '$ts/stores/window';
	import { portal } from 'svelte-portal';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { routesDrawer } from './routes';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import { page } from '$app/stores';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import LogoButton from '$components/buttons/LogoButton.svelte';
	import { browser } from '$app/environment';
	import ScBar from '$components/ScBar.svelte';
	import { onDestroy } from 'svelte';
	import IconNew from '$components/icons/IconNew.svelte';
	export let hasCustomContent = false;

	$: $isDrawerOpen, onIsDrawerOpenChanged();

	function onIsDrawerOpenChanged() {
		if (!browser) return;
		if ($isDrawerOpen) {
			document.body.classList.add('overflow-hidden-for-drawer');
		} else {
			document.body.classList.remove('overflow-hidden-for-drawer');
		}
	}

	onDestroy(() => {
		if (!browser) return;
		document.body.classList.remove('overflow-hidden-for-drawer');
	});
</script>

{#if $isDrawerOpen}
	<div
		transition:fade|local={{ duration: 250, easing: quadOut }}
		use:portal={'body'}
		style="height: 100vh; height: 100svh"
		class="w-full md:hidden md:pointer-events-none fixed left-0 top-0 bg-c-barrier/80 z-100"
	/>
{/if}
<div
	use:clickoutside={{
		callback: () => {
			isDrawerOpen.set(false);
		}
	}}
	style={$windowHeight ? `height: ${$windowHeight}px` : 'height: 100vh; height: 100svh'}
	use:portal={'body'}
	class="fixed md:hidden md:pointer-events-none w-[85%] bg-c-bg rounded-r-3xl border-2 border-c-bg-secondary left-0 top-0 z-[101]
			shadow-drawer {$isDrawerOpen
		? 'shadow-c-shadow/[var(--o-shadow-stronger)]'
		: 'shadow-c-shadow/0'} transition duration-250 {$isDrawerOpen
		? '-translate-x-2px'
		: 'pointer-events-none -translate-x-[calc(100%+2px)]'} flex flex-col justify-start overflow-hidden"
>
	<div class="w-full flex flex-row justify-between gap-5 items-stretch">
		<LogoButton />
		<button
			aria-label="Close Drawer"
			on:click={() => isDrawerOpen.set(false)}
			class="w-14 py-4 flex items-center justify-center group overflow-hidden relative z-0"
		>
			<ButtonHoverEffect size="md" noRounding noPadding hoverFrom="right" />
			<IconCancel class="text-c-on-bg/25 w-7 h-7 transition not-touch:group-hover:text-c-primary" />
		</button>
	</div>
	<div class="w-full h-2px bg-c-bg-secondary" />
	<slot name="header" />
	<div class="w-full flex flex-col flex-1 overflow-hidden">
		{#if hasCustomContent}
			<slot />
		{:else}
			<ScrollAreaWithChevron class="pb-20">
				{#each $routesDrawer as route}
					{@const isSelected = route.strictMatch
						? $page.url.pathname === route.href
						: $page.url.pathname.startsWith(route.href)}
					<a
						href={route.href}
						data-sveltekit-preload-data="hover"
						class="w-full flex items-center justify-start text-lg p-1 relative group font-semibold"
					>
						<ButtonHoverEffect size="md" hoverFrom="left" />
						<div
							class="w-full flex items-center justify-start px-4 py-3 gap-3 rounded-lg {isSelected
								? 'bg-c-primary/10 text-c-primary'
								: ''}"
						>
							<IconNavbarRoute
								type={route.icon}
								class="not-touch:group-hover:text-c-primary transition flex-shrink-0"
							/>
							<p
								class="break-words flex flex-col overflow-hidden
								not-touch:group-hover:text-c-primary transition flex-shrink"
							>
								{route.name}
							</p>
							{#if route.href === '/voiceover/generate'}
								<IconNew class="w-6 h-6 flex-shrink-0 transform scale-100 text-c-primary -ml-1.5" />
							{/if}
						</div>
					</a>
				{/each}
			</ScrollAreaWithChevron>
		{/if}
	</div>
	<div
		class="w-full px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] border-t-2 border-c-bg-secondary"
	>
		<ScBar withEmail />
	</div>
</div>
