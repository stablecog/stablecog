<script lang="ts">
	import { page } from '$app/stores';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';
	import { expandCollapse } from '$ts/animation/transitions';

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

<div class="flex flex-col justify-start {classes}">
	{#if !isRoot}
		<div class="flex relative">
			<a
				class="w-full text-lg md:text-base flex items-center gap-2 px-3 py-3 md:py-2.5 group relative rounded-lg overflow-hidden z-0"
				href={sidebarItem.pathname}
				on:click={toggle}
				data-sveltekit-preload-data="hover"
			>
				<ButtonHoverEffect
					color={isSelected ? 'primary' : 'on-bg'}
					hoverFrom="left"
					size="md"
					hovered={isSelected}
				/>
				<p
					class="flex-1 transition-all {isSelected
						? 'text-c-primary font-semibold'
						: level === 0 || level === 1
						? 'text-c-on-bg font-medium'
						: 'text-c-on-bg/75 font-normal'}"
				>
					{sidebarItem.title}
				</p>
				{#if sidebarItem.children}
					<IconChevronDown
						class="w-5 h-5 md:w-4 md:h-4 transform transition {$page.url.pathname ===
						sidebarItem.pathname
							? 'text-c-primary'
							: level > 1
							? 'text-c-on-bg/75'
							: 'text-c-on-bg'} {isOpen ? 'rotate-0' : '-rotate-90 group-hover:translate-x-1'}"
					/>
				{/if}
			</a>
			{#if sidebarItem.children}
				<button
					name="Dropdown"
					on:click={() => (isOpen = !isOpen)}
					class="w-11 md:w-10 h-full absolute right-0 top-0 z-10 group"
				>
					<ButtonHoverEffect size="md" color={isSelected ? 'primary' : 'on-bg'} hoverFrom="left" />
				</button>
			{/if}
		</div>
	{/if}
	{#if (isRoot || isOpen) && sidebarItem.children}
		<div
			transition:expandCollapse|local={{ duration: 200 }}
			class="w-full flex flex-row {!isRoot ? 'pl-3' : ''}"
		>
			{#if !isRoot}
				<div class="h-full w-2px rounded-full py-1.5 mr-1.5">
					<div class="h-full w-full bg-c-bg-secondary" />
				</div>
			{/if}
			<div class="flex-1 flex flex-col">
				{#each sidebarItem.children as child}
					<svelte:self sidebarItem={child} isRoot={false} level={level + 1} />
				{/each}
			</div>
		</div>
	{/if}
</div>
