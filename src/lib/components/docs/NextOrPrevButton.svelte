<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';

	export let item: TSidebarItem;
	export let type: 'next' | 'prev';
</script>

<a
	data-sveltekit-preload-data="hover"
	href={item.pathname}
	class="w-full md:w-auto md:flex-1 max-w-full overflow-hidden gap-4 px-4 py-3 flex group justify-between items-center
  rounded-xl ring-2 ring-c-bg-secondary group relative bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {type ===
	'next'
		? 'text-left'
		: 'text-right'}"
>
	<ButtonHoverEffect
		noPadding
		color="bg-secondary"
		hoverFrom={type === 'next' ? 'left' : 'right'}
	/>
	{#if type === 'prev'}
		<IconArrowRight
			class="transform rotate-180 w-5 h-5 text-c-on-bg/50 transition not-touch:group-hover:-translate-x-1.5
			not-touch:group-hover:text-c-primary"
		/>
	{/if}
	<div
		class="flex-1 overflow-hidden flex flex-col z-0 relative {type === 'next'
			? 'items-start'
			: 'items-end'}"
	>
		<p
			class="max-w-full font-normal overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-c-on-bg/60"
		>
			{type === 'next' ? $LL.Guide.NextTitle() : $LL.Guide.PreviousTitle()}
		</p>
		<p
			class="max-w-full font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mt-0.5
			text-c-on-bg transition not-touch:group-hover:text-c-primary"
		>
			{item.title}
		</p>
	</div>
	{#if type === 'next'}
		<IconArrowRight
			class="w-5 h-5 text-c-on-bg/50 transition not-touch:group-hover:translate-x-1.5 
			not-touch:group-hover:text-c-primary"
		/>
	{/if}
</a>
