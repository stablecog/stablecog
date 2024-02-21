<script lang="ts">
	import { page } from '$app/stores';
	import type { TTabBarPlacement } from '$ts/types/main';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import { routes, type TNavbarRoute } from '$components/navigation/routes';
	import NavigationTabBarItem from '$components/navigation/navigationTabBar/NavigationTabBarItem.svelte';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import LL from '$i18n/i18n-svelte';
	import DropdownWrapperTranslate from '$components/primitives/dropdown/DropdownWrapperTranslate.svelte';
	import IconCommandLineOutlined from '$components/icons/IconCommandLineOutlined.svelte';
	import IconGuideOutline from '$components/icons/IconGuideOutline.svelte';
	import IconBlogOutline from '$components/icons/IconBlogOutline.svelte';
	import IconLive from '$components/icons/IconLive.svelte';
	import ScrollAreaWithChevron from '$components/utils/ScrollAreaWithChevron.svelte';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';

	export let type: TTabBarPlacement = 'normal';

	let elements: Record<string, HTMLAnchorElement | HTMLDivElement> = {};

	let isResourcesDropdownOpen = false;

	const toggleResourcesDropdown = () => {
		isResourcesDropdownOpen = !isResourcesDropdownOpen;
	};

	const closeResourcesDropdown = () => {
		isResourcesDropdownOpen = false;
	};

	let _routes: TNavbarRoute[];
	$: _routes = [
		...$routes,
		{
			name: $LL.Resources.PageTitle(),
			href: '/resources',
			strictMatch: true,
			onClick: toggleResourcesDropdown,
			icon: 'resources'
		}
	];

	const isSelected = (
		route: TNavbarRoute,
		currentPath: string,
		isResourcesDropdownOpen: boolean
	) => {
		if (route.icon === 'resources' && isResourcesDropdownOpen) {
			return true;
		}
		if (route.icon !== 'resources' && isResourcesDropdownOpen) {
			return false;
		}
		if (route.strictMatch) {
			return $page.url.pathname === route.href;
		}
		return currentPath.startsWith(route.href);
	};

	const routeIndexOf = (currentPath: string, isResourcesDropdownOpen: boolean) => {
		return isResourcesDropdownOpen
			? _routes.findIndex((r) => r.icon === 'resources')
			: _routes.findIndex((route) => isSelected(route, currentPath, isResourcesDropdownOpen));
	};

	$: widths =
		Object.keys(elements).length > 0
			? Object.keys(elements)
					.sort((a, b) => Number(a) - Number(b))
					.map((i) => (elements[i] ? elements[i].getBoundingClientRect().width : 0))
			: _routes.map(() => 0);

	$: selectedRouteIndex = routeIndexOf($page.url.pathname, isResourcesDropdownOpen);
	$: selectedRouteWidth = widths[selectedRouteIndex];
	$: selectedRouteLeft = widths
		.slice(0, selectedRouteIndex < 0 ? widths.length : selectedRouteIndex)
		.reduce((acc, cur) => acc + cur, 0);

	const [resourceDropdownFloatingRef, resourceDropdownFloatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'top-end',
		middleware: [offset(2), flip(), shift()]
	});
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
							: selectedRouteIndex === _routes.length - 1
								? 'py-1 pr-1 pl-0.5'
								: 'py-1 px-0.5'}"
				>
					<div
						class="w-full h-full bg-c-bg-secondary rounded-lg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
					/>
				</div>
			</div>
			{#each _routes as route, index}
				<NavigationTabBarItem
					bind:clientWidth={widths[index]}
					bind:element={elements[index]}
					ariaLabel="Go to {route.name}"
					isSelected={isSelected(route, $page.url.pathname, isResourcesDropdownOpen)}
					href={route.href}
					icon={route.icon}
					label={route.name}
					{index}
					length={_routes.length}
					hasDropdown={route.onClick !== undefined}
					onClick={route.onClick}
					floatingRef={route.icon === 'resources' ? resourceDropdownFloatingRef : undefined}
				>
					<div
						slot="dropdown"
						class="{route.icon === 'resources' ? 'block' : 'hidden'} absolute bottom-0 right-0"
					>
						{#if route.icon === 'resources' && isResourcesDropdownOpen}
							<DropdownWrapperTranslate
								floatingContent={resourceDropdownFloatingContent}
								alignment="top-0 right-0"
								onClickoutside={closeResourcesDropdown}
								excludeFromClickoutside={[elements[index]]}
								class="w-192 max-w-[calc(100vw-1.25rem)] md:w-48 md:max-w-[calc(100vw-1.25rem)]"
							>
								<ScrollAreaWithChevron
									class="w-full flex flex-col justify-start max-h-[calc(80vh-4rem)] md:max-h-[calc(80vh-4rem)] transition-all duration-100 hide-scrollbar"
								>
									<div class="w-full flex flex-col justify-start items-start">
										<DropdownItem
											target="_blank"
											href="/guide"
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
												<IconGuideOutline
													class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
												/>
												<p
													class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
												>
													{$LL.Guide.PageTitle()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem
											target="_blank"
											href="/blog"
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
												<IconBlogOutline
													class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
												/>
												<p
													class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
												>
													{$LL.Blog.TitleAlt()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem
											target="_blank"
											href="/docs/v1"
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
												<IconCommandLineOutlined
													class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
												/>
												<p
													class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
												>
													{$LL.Documentation.ForDevelopersTitle()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem href="/live" padding="md" onClick={closeResourcesDropdown}>
											<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
												<IconLive
													class="transition w-6 h-6 text-c-text not-touch:group-hover:text-c-primary"
												/>
												<p
													class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg not-touch:group-hover:text-c-primary"
												>
													{$LL.Navbar.LiveTab()}
												</p>
											</div>
										</DropdownItem>
									</div>
								</ScrollAreaWithChevron>
							</DropdownWrapperTranslate>
						{/if}
					</div>
				</NavigationTabBarItem>
			{/each}
		</div>
	</div>
</TabBarWrapper>
