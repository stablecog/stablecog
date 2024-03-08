<script lang="ts">
	import { page } from '$app/stores';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import ListOrDiv from '$components/docs/ListOrDiv.svelte';
	import MethodBadge from '$components/docs/MethodBadge.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';
	import { expandCollapse } from '$ts/animation/transitions';
	import { closeDrawer } from '$ts/stores/isDrawerOpen';

	export let sidebarItem: TSidebarItem;
	export let isRoot = true;
	export { classes as class };
	export let level = 0;
	let classes = 'w-full';

	$: isSelected = $page.url.pathname === sidebarItem.pathname;
	$: hasSelectedChild = getHasSelectedChild(sidebarItem, $page.url.pathname);
	$: isOpen = (isSelected || hasSelectedChild) ?? false;

	const toggle = () => {
		if ($page.url.pathname !== sidebarItem.pathname && isOpen) return;
		isOpen = !isOpen;
	};

	function getHasSelectedChild(sidebarItem: TSidebarItem, currentPathname: string): boolean {
		if (!sidebarItem.children) return false;
		for (let i = 0; i < sidebarItem.children.length; i++) {
			if (sidebarItem.children[i].pathname === currentPathname) return true;
			const hasSelected = getHasSelectedChild(sidebarItem.children[i], currentPathname);
			if (hasSelected) return true;
		}
		return false;
	}
</script>

<ListOrDiv as={isRoot ? 'div' : 'li'} class="flex w-full flex-col justify-start {classes}">
	{#if !isRoot}
		<div class="relative flex w-full">
			<a
				class="group relative z-0 flex w-full items-center gap-4 overflow-hidden rounded-lg px-4 py-3.5 text-lg md:py-2.5 md:text-base"
				href={sidebarItem.pathname}
				on:click={() => {
					toggle();
					closeDrawer();
				}}
				data-sveltekit-preload-data="hover"
			>
				<ButtonHoverEffect
					color={isSelected
						? sidebarItem.http_method === 'POST'
							? 'secondary'
							: sidebarItem.http_method === 'GET'
								? 'success'
								: 'primary'
						: 'on-bg'}
					hoverFrom="left"
					size="md"
					hovered={isSelected}
					noPadding
					paddingClass="px-1.5 py-2px"
				/>
				<p
					class="relative w-0 min-w-0 flex-1 overflow-hidden break-words transition-all {isSelected
						? sidebarItem.http_method === 'POST'
							? 'text-c-secondary'
							: sidebarItem.http_method === 'GET'
								? 'text-c-success'
								: 'text-c-primary'
						: ''} {isSelected
						? 'font-semibold'
						: level === 0 || level === 1
							? 'font-medium text-c-on-bg'
							: 'font-normal text-c-on-bg/75'} relative"
				>
					{sidebarItem.title}
				</p>
				<div class="relative flex flex-shrink-0 items-center justify-end gap-3">
					{#if sidebarItem.http_method}
						<MethodBadge size="sm" method={sidebarItem.http_method} />
					{/if}
					{#if sidebarItem.children}
						<IconChevronDown
							class="h-5.5 w-5.5 transform transition md:h-4 md:w-4 {$page.url.pathname ===
							sidebarItem.pathname
								? 'text-c-primary'
								: level > 1
									? 'text-c-on-bg/75'
									: 'text-c-on-bg'} {isOpen ? 'rotate-0' : '-rotate-90 group-hover:translate-x-1'}"
						/>
					{/if}
				</div>
			</a>
			{#if sidebarItem.children}
				<button
					aria-label="{isOpen ? 'Collapse ' : 'Expand '} + {sidebarItem.title}"
					on:click={() => (isOpen = !isOpen)}
					class="group absolute right-1 top-0 z-10 h-full w-12 md:w-10"
				>
					<ButtonHoverEffect size="sm" color={isSelected ? 'primary' : 'on-bg'} hoverFrom="left" />
				</button>
			{/if}
		</div>
	{/if}
	{#if (isRoot || isOpen) && sidebarItem.children}
		<div
			transition:expandCollapse={{ duration: 200 }}
			class="flex w-full flex-row {!isRoot ? 'pl-3' : ''}"
		>
			{#if !isRoot}
				<div class="mr-1.5 h-full w-2px rounded-full py-1.5">
					<div class="h-full w-full bg-c-bg-secondary" />
				</div>
			{/if}
			<ul class="flex flex-1 flex-col">
				{#each sidebarItem.children as child}
					<svelte:self sidebarItem={child} isRoot={false} level={level + 1} />
				{/each}
			</ul>
		</div>
	{/if}
</ListOrDiv>
