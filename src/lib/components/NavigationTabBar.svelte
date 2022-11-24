<script lang="ts">
	import { page } from '$app/stores';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TNavbarRoute, TTabBarPlacement } from '$ts/types/main';
	import TabBarWrapper from './TabBarWrapper.svelte';
	import LL from '$i18n/i18n-svelte';

	export let type: TTabBarPlacement = 'normal';

	const isSelected = (href: string, currentPath: string) => {
		return $page.url.pathname === href || currentPath.startsWith(href + '/');
	};

	const routeIndexOf = (currentPath: string) => {
		return routes.findIndex((route) => isSelected(route.href, currentPath));
	};

	let routes: TNavbarRoute[];
	$: routes = [
		{
			name: $LL.Navbar.HomeTab(),
			href: '/',
			icon: 'home'
		},
		{
			name: $LL.Navbar.HistoryTab(),
			href: '/history',
			icon: 'history'
		},
		{
			name: $LL.Navbar.GalleryTab(),
			href: '/gallery',
			icon: 'gallery'
		},
		{
			name: $LL.Navbar.LiveTab(),
			href: '/live',
			icon: 'live'
		}
	];
</script>

<TabBarWrapper class="w-full" {type}>
	<div class="w-full flex pb-[env(safe-area-inset-bottom)] md:pb-0">
		<div class="w-full flex relative">
			<div
				class="w-full h-full absolute left-0 top-0 overflow-hidden rounded-r-xl z-0 pointer-events-none"
			>
				<div
					style="width: {(1 / routes.length) * 100}%; transform: translateX({routeIndexOf(
						$page.url.pathname
					) * 100}%)"
					class="h-full absolute left-0 top-0 transition {type === 'bottom'
						? 'px-1.5 pt-1.5 pb-2'
						: 'p-1'}"
				>
					<div
						class="w-full h-full bg-c-bg-secondary rounded-lg shadow-md shadow-c-shadow/[var(--o-shadow-strong)] "
					/>
				</div>
			</div>
			{#each routes as route}
				<a
					aria-label="Go to {route.name}"
					data-sveltekit-prefetch
					class="flex-1 rounded-lg whitespace-nowrap overflow-hidden group self-stretch flex 
					items-center justify-center px-4 transition-all relative {type === 'bottom'
						? 'pt-4 pb-4.5'
						: 'py-4'} {isSelected(route.href, $page.url.pathname)
						? 'text-c-on-bg font-bold'
						: 'text-c-on-bg/50 font-semibold'} {isSelected(route.href, $page.url.pathname) &&
					!$isTouchscreen
						? 'hover:text-c-primary'
						: 'text-c-on-bg'}"
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
									bg-c-bg-secondary {isSelected(route.href, $page.url.pathname)
									? 'group-focus-within:translate-y-0'
									: ''} {!$isTouchscreen ? 'group-hover:translate-y-0' : ''}"
							/>
						</div>
					</div>
					<div class="w-full flex justify-center items-center gap-1.5 relative md:-ml-1">
						<IconNavbarRoute class="w-6 h-6 md:w-5 md:h-5" type={route.icon} />
						<p
							class="hidden md:block flex-shrink min-w-0 text-center overflow-hidden overflow-ellipsis"
						>
							{route.name}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</TabBarWrapper>
