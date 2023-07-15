<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import type { TPostToCItem } from '$docroutes/blog/types';

	export let item: TPostToCItem;
	export let activeId: string;

	function titleToId(title: string) {
		return title
			.toLowerCase()
			.replace(/[# ]+/g, '-')
			.replace(/[\“\”\"\:\$&,’./\?]+/g, '');
	}

	$: id = titleToId(item.title);
</script>

<div style="padding-left: {0.75 * Math.max(item.level - 2)}rem" class="w-full flex justify-start">
	<a
		class="w-full {item.level <= 2 ? 'font-medium' : 'font-normal'} px-3 py-1.5 relative group"
		href="#{id}"
	>
		<ButtonHoverEffect
			hovered={id === activeId}
			color={id === activeId ? 'primary' : 'on-bg'}
			hoverFrom="left"
			size="sm"
			paddingClass="p-0.5"
		/>
		<p
			class="transition {id === activeId
				? 'text-c-primary'
				: item.level <= 2
				? 'text-c-on-bg'
				: item.level === 3
				? 'text-c-on-bg/75'
				: ' text-c-on-bg/50'}"
		>
			{item.title}
		</p>
	</a>
</div>

{#if item.children}
	{#each item.children as childrenItem}
		<svelte:self item={childrenItem} {activeId} />
	{/each}
{/if}
