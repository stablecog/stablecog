<script lang="ts">
	import { page } from '$app/stores';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import type { TTabBarPlacement } from '$ts/types/main';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import { routes, type TNavbarRoute } from '$components/navigation/routes';

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
</script>

<TabBarWrapper class="w-full" {type}>
	<div class="w-full flex md:pb-0 {type === 'bottom' ? 'pb-[env(safe-area-inset-bottom)]' : ''}">
		<div class="w-full flex relative">
			<div
				class="w-full h-full absolute left-0 top-0 overflow-hidden rounded-r-xl z-0 pointer-events-none"
			>
				<div
					style="width: {(1 / $routes.length) * 100}%; transform: translateX({routeIndexOf(
						$page.url.pathname
					) * 100}%)"
					class="h-full absolute left-0 top-0 transition {type === 'bottom'
						? 'px-1.5 pt-1.5 pb-2'
						: 'p-1'}"
				>
					<div
						class="w-full h-full bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-strong)]"
					/>
				</div>
			</div>
			{#each $routes as route}
				<a
					aria-label="Go to {route.name}"
					data-sveltekit-preload-data="hover"
					class="flex-1 rounded-lg whitespace-nowrap overflow-hidden group self-stretch flex
					items-center justify-center px-4 transition-all relative font-semibold {type === 'bottom'
						? 'pt-4 pb-4.5'
						: 'py-4'} {isSelected(route, $page.url.pathname)
						? 'text-c-on-bg not-touch:hover:text-c-primary'
						: 'text-c-on-bg/50'}"
					href={route.href}
				>
					<div
						class="w-full h-full absolute left-0 top-0 rounded-lg {type === 'bottom'
							? 'px-1.5 pt-1.5 pb-2'
							: 'p-1'}"
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
					<div class="w-full flex justify-center items-center gap-1.5 relative lg:-ml-1">
						<IconNavbarRoute class="w-6 h-6 md:w-5 md:h-5" type={route.icon} />
						<p
							class="hidden lg:block flex-shrink min-w-0 text-center overflow-hidden overflow-ellipsis"
						>
							{route.name}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</TabBarWrapper>
