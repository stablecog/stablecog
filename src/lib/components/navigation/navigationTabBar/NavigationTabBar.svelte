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
	import IconSc from '$components/icons/IconSc.svelte';
	import { socialAppUrls } from '$ts/constants/social';

	export let type: TTabBarPlacement = 'normal';

	let elements: Record<string, HTMLAnchorElement | HTMLButtonElement> = {};

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
		...(($page.url.pathname.startsWith('/admin')
			? ([] as TNavbarRoute[])
			: [
					{
						name: $LL.Resources.PageTitle(),
						href: '/resources',
						strictMatch: true,
						onClick: toggleResourcesDropdown,
						icon: 'resources'
					}
				]) as TNavbarRoute[])
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

	function isPathMatching(current: string, pathname: string) {
		return pathname === current || pathname.startsWith(current + '/');
	}
</script>

<TabBarWrapper class="max-w-full" {type}>
	<div
		class="flex max-w-full md:pb-0 {type === 'bottom' ? 'pb-[env(safe-area-inset-bottom)]' : ''}"
	>
		<div class="relative flex w-full">
			<div
				class="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden rounded-xl"
			>
				<div
					style="width: {selectedRouteWidth}px; transform: translateX({selectedRouteLeft}px);"
					class="absolute left-0 top-0 h-full transition {type === 'bottom'
						? 'px-1.5 pb-2 pt-1.5'
						: selectedRouteIndex === 0
							? 'py-1 pl-1 pr-0.5'
							: selectedRouteIndex === _routes.length - 1
								? 'py-1 pl-0.5 pr-1'
								: 'px-0.5 py-1'}"
				>
					<div
						class="h-full w-full rounded-lg bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
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
					isDropdownOpen={route.onClick !== undefined &&
						route.icon === 'resources' &&
						isResourcesDropdownOpen}
					onClick={route.onClick}
					floatingRef={route.icon === 'resources' ? resourceDropdownFloatingRef : () => undefined}
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
								class="w-192 max-w-[calc(100vw-1.25rem)] md:w-56 md:max-w-[calc(100vw-1.25rem)]"
							>
								<ScrollAreaWithChevron
									class="hide-scrollbar flex max-h-[calc(80vh-4rem)] w-full flex-col justify-start transition-all duration-100 md:max-h-[calc(80vh-4rem)]"
								>
									<div class="flex w-full flex-col items-start justify-start">
										<DropdownItem
											target={isPathMatching('/guide', $page.url.pathname) ? undefined : '_blank'}
											href="/guide"
											isSelected={isPathMatching('/guide', $page.url.pathname)}
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
												<IconGuideOutline
													class="h-6 w-6 {isPathMatching('/guide', $page.url.pathname)
														? 'text-c-primary'
														: 'text-c-on-bg'} transition not-touch:group-hover:text-c-primary"
												/>
												<p
													class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left {isPathMatching(
														'/guide',
														$page.url.pathname
													)
														? 'text-c-primary'
														: 'text-c-on-bg'}
													transition not-touch:group-hover:text-c-primary"
												>
													{$LL.Guide.PageTitle()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem
											target={isPathMatching('/blog', $page.url.pathname) ? undefined : '_blank'}
											href="/blog"
											isSelected={isPathMatching('/blog', $page.url.pathname)}
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
												<IconBlogOutline
													class="{isPathMatching('/blog', $page.url.pathname)
														? 'text-c-primary'
														: 'text-c-on-bg'} h-6 w-6 transition not-touch:group-hover:text-c-primary"
												/>
												<p
													class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left {isPathMatching(
														'/blog',
														$page.url.pathname
													)
														? 'text-c-primary'
														: 'text-c-on-bg'} transition not-touch:group-hover:text-c-primary"
												>
													{$LL.Blog.TitleAlt()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem
											target={isPathMatching('/docs', $page.url.pathname) ? undefined : '_blank'}
											href="/docs/v1"
											isSelected={isPathMatching('/docs', $page.url.pathname)}
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
												<IconCommandLineOutlined
													class="{isPathMatching('/docs', $page.url.pathname)
														? 'text-c-primary'
														: 'text-c-on-bg'} h-6 w-6 transition not-touch:group-hover:text-c-primary"
												/>
												<p
													class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left {isPathMatching(
														'/docs',
														$page.url.pathname
													)
														? 'text-c-primary'
														: 'text-c-on-bg'} transition not-touch:group-hover:text-c-primary"
												>
													{$LL.Documentation.DevelopersTitle()}
												</p>
											</div>
										</DropdownItem>
										<DropdownItem
											isSelected={isPathMatching('/live', $page.url.pathname)}
											href="/live"
											padding="md"
											onClick={closeResourcesDropdown}
										>
											<div class="flex min-w-0 flex-1 items-center justify-start gap-2.5">
												<IconLive
													class="{isPathMatching('/live', $page.url.pathname)
														? 'text-c-primary'
														: 'text-c-on-bg'} h-6 w-6 transition not-touch:group-hover:text-c-primary"
												/>
												<p
													class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-left {isPathMatching(
														'/live',
														$page.url.pathname
													)
														? 'text-c-primary'
														: 'text-c-on-bg'} transition not-touch:group-hover:text-c-primary"
												>
													{$LL.Navbar.LiveTab()}
												</p>
											</div>
										</DropdownItem>
										<div class="h-2px w-full bg-c-bg-tertiary"></div>
										<div class="flex w-full flex-wrap">
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.discord}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="discord"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.twitter}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="twitter"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.instagram}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="instagram"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.email}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="email"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.producthunt}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="producthunt"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
											<DropdownItem
												equalHoverEffectPadding
												class="w-1/3"
												href={socialAppUrls.github}
												target="_blank"
												padding="md"
												onClick={closeResourcesDropdown}
											>
												<div
													class="-mx-2 -my-0.5 flex min-w-0 flex-1 items-center justify-center gap-2.5"
												>
													<IconSc
														type="github"
														class="h-7 w-7 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
													/>
												</div>
											</DropdownItem>
										</div>
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
