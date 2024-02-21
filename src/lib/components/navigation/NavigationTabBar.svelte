<script lang="ts">
	import { page } from '$app/stores';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import type { TTabBarPlacement } from '$ts/types/main';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import { routes, type TNavbarRoute } from '$components/navigation/routes';
	import IconNew from '$components/icons/IconNew.svelte';

	export let type: TTabBarPlacement = 'normal';

	const isSelected = (route: TNavbarRoute, currentPath: string) => {
		if (route.strictMatch) {
			return $page.url.pathname === route.href;
		}
		return currentPath.startsWith(route.href);
	};

	const routeIndexOf = (currentPath: string) => {
		return $routes.findIndex((route) => isSelected(route, currentPath));
	};

	let elements: Record<string, HTMLAnchorElement> = {};
	$: widths =
		Object.keys(elements).length > 0
			? Object.keys(elements)
					.sort((a, b) => Number(a) - Number(b))
					.map((i) => (elements[i] ? elements[i].getBoundingClientRect().width : 0))
			: $routes.map(() => 0);

	$: selectedRouteIndex = routeIndexOf($page.url.pathname);
	$: selectedRouteWidth = widths[selectedRouteIndex];
	$: selectedRouteLeft = widths
		.slice(0, selectedRouteIndex < 0 ? widths.length : selectedRouteIndex)
		.reduce((acc, cur) => acc + cur, 0);
</script>

<TabBarWrapper class="max-w-full" {type}>
	<div
		class="max-w-full flex md:pb-0 {type === 'bottom' ? 'pb-[env(safe-area-inset-bottom)]' : ''}"
	>
		<div class="w-full flex relative">
			<div
				class="w-full h-full absolute left-0 top-0 overflow-hidden rounded-xl z-0 pointer-events-none"
			>
				<div
					style="width: {selectedRouteWidth}px; transform: translateX({selectedRouteLeft}px);"
					class="h-full absolute left-0 top-0 transition {type === 'bottom'
						? 'px-1.5 pt-1.5 pb-2'
						: selectedRouteIndex === 0
							? 'py-1 pl-1 pr-0.5'
							: selectedRouteIndex === $routes.length - 1
								? 'py-1 pr-1 pl-0.5'
								: 'py-1 px-0.5'}"
				>
					<div
						class="w-full h-full bg-c-bg-secondary rounded-lg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
					/>
				</div>
			</div>
			{#each $routes as route, index}
				<a
					bind:clientWidth={widths[index]}
					bind:this={elements[index]}
					aria-label="Go to {route.name}"
					data-sveltekit-preload-data="hover"
					class="max-w-full rounded-lg whitespace-nowrap overflow-hidden group self-stretch flex
					items-center justify-center px-5 transition-all relative font-semibold {type === 'bottom'
						? 'pt-4 pb-4.5'
						: 'py-4'} {isSelected(route, $page.url.pathname)
						? 'text-c-on-bg not-touch:hover:text-c-primary'
						: 'text-c-on-bg/75'}"
					href={route.href}
				>
					<div
						class="w-full h-full absolute left-0 top-0 rounded-lg {type === 'bottom'
							? 'px-1.5 pt-1.5 pb-2'
							: index === 0
								? 'py-1 pl-1 pr-0.5'
								: index === $routes.length - 1
									? 'py-1 pr-1 pl-0.5'
									: 'py-1 px-0.5'}"
					>
						<div class="w-full h-full overflow-hidden relative z-0 rounded-lg">
							<div
								class="w-full h-full origin-left rounded-lg transition transform translate-y-full
									bg-c-bg-secondary {isSelected(route, $page.url.pathname)
									? 'group-focus-within:translate-y-0'
									: ''} not-touch:group-hover:translate-y-0"
							/>
						</div>
					</div>
					<div class="flex-shrink min-w-0 flex justify-center items-center gap-1.5 relative">
						<IconNavbarRoute
							class="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 transform scale-100"
							type={route.icon}
						/>
						<p
							class="hidden {route.iconOnly
								? ''
								: 'lg:block'} flex-shrink min-w-0 text-center overflow-hidden overflow-ellipsis"
						>
							{route.name}
						</p>
					</div>
					{#if route.href === '/voiceover/generate'}
						<div class="absolute right-1.5 top-1.5 2xl:right-2 2xl:top-2">
							<IconNew class="w-5 h-5 transform scale-100 text-c-primary" />
						</div>
					{/if}
				</a>
			{/each}
		</div>
	</div>
</TabBarWrapper>
