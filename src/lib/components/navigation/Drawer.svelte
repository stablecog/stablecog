<script>
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';

	import { clickoutside } from '$ts/actions/clickoutside';
	import { closeDrawer, isDrawerOpen } from '$ts/stores/isDrawerOpen';
	import { windowHeight } from '$ts/stores/window';
	import { portal } from 'svelte-portal';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { routesDrawer } from './routes';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import { page } from '$app/stores';
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import LogoButton from '$components/primitives/buttons/LogoButton.svelte';
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
		transition:fade={{ duration: 250, easing: quadOut }}
		use:portal={'body'}
		style="height: 100vh; height: 100svh"
		class="fixed left-0 top-0 z-100 w-full bg-c-barrier/80 md:pointer-events-none md:hidden"
	/>
{/if}
<nav
	use:clickoutside={{
		callback: closeDrawer
	}}
	style={$windowHeight ? `height: ${$windowHeight}px` : 'height: 100vh; height: 100svh'}
	use:portal={'body'}
	class="fixed left-0 top-0 z-[101] w-[85%] rounded-r-3xl border-2 border-c-bg-secondary bg-c-bg shadow-drawer md:pointer-events-none
			md:hidden {$isDrawerOpen
		? 'shadow-c-shadow/[var(--o-shadow-stronger)]'
		: 'shadow-c-shadow/0'} transition duration-300 {$isDrawerOpen
		? '-translate-x-2px'
		: 'pointer-events-none -translate-x-[calc(100%+2px)]'} flex flex-col justify-start overflow-hidden"
>
	<div class="flex w-full flex-row items-stretch justify-between gap-5">
		<LogoButton onClick={closeDrawer} />
		<button
			aria-label="Close Drawer"
			on:click={() => isDrawerOpen.set(false)}
			class="group relative z-0 flex w-14 items-center justify-center overflow-hidden py-4"
		>
			<ButtonHoverEffect size="md" noRounding noPadding hoverFrom="right" />
			<IconCancel class="h-7 w-7 text-c-on-bg/25 transition not-touch:group-hover:text-c-primary" />
		</button>
	</div>
	<div class="h-2px w-full bg-c-bg-secondary" />
	<slot name="header" />
	<div class="flex w-full flex-1 flex-col overflow-hidden">
		{#if hasCustomContent}
			<slot />
		{:else}
			<ScrollAreaWithChevron fadeColor="bg" class="pb-20">
				<ul class="flex w-full flex-col">
					{#each $routesDrawer as route, index}
						{@const isSelected = route.strictMatch
							? $page.url.pathname === route.href
							: $page.url.pathname.startsWith(route.href)}
						<li class="w-full">
							<a
								href={route.href}
								on:click={closeDrawer}
								data-sveltekit-preload-data="hover"
								class="flex w-full items-center justify-start px-1.5 py-2px text-lg {index === 0 &&
									'pt-1.5'} group relative font-semibold"
							>
								<ButtonHoverEffect
									size="md"
									hoverFrom="left"
									noPadding
									paddingClass="px-1.5 py-2px {index === 0 && 'pt-1.5'}"
								/>
								<div
									class="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3.5 {isSelected
										? 'bg-c-primary/10 text-c-primary'
										: ''}"
								>
									<IconNavbarRoute
										type={route.icon}
										class="flex-shrink-0 transition not-touch:group-hover:text-c-primary"
									/>
									<p
										class="flex flex-shrink flex-col overflow-hidden
										break-words transition not-touch:group-hover:text-c-primary"
									>
										{route.name}
									</p>
									{#if route.href === '/voiceover/generate'}
										<IconNew
											class="-ml-1.5 h-6 w-6 flex-shrink-0 scale-100 transform text-c-primary"
										/>
									{/if}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</ScrollAreaWithChevron>
		{/if}
	</div>
	<div
		class="w-full border-t-2 border-c-bg-secondary px-4 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2"
	>
		<ScBar noGuide noBlog />
	</div>
</nav>
