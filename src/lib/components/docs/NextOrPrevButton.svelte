<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';

	export let item: TSidebarItem;
	export let type: 'next' | 'prev';
</script>

<a
	data-sveltekit-preload-data="hover"
	href={item.pathname}
	class="group group relative flex w-full max-w-full items-center justify-between gap-4 overflow-hidden rounded-xl bg-c-bg
  px-4 py-3 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-secondary md:w-auto md:flex-1 {type ===
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
			class="h-5 w-5 rotate-180 transform text-c-on-bg/50 transition not-touch:group-hover:-translate-x-1.5
			not-touch:group-hover:text-c-primary"
		/>
	{/if}
	<div
		class="relative z-0 flex flex-1 flex-col overflow-hidden {type === 'next'
			? 'items-start'
			: 'items-end'}"
	>
		<p
			class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-normal text-c-on-bg/60"
		>
			{type === 'next' ? $LL.Guide.NextTitle() : $LL.Guide.PreviousTitle()}
		</p>
		<p
			class="mt-0.5 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold
			text-c-on-bg transition not-touch:group-hover:text-c-primary"
		>
			{item.title}
		</p>
	</div>
	{#if type === 'next'}
		<IconArrowRight
			class="h-5 w-5 text-c-on-bg/50 transition not-touch:group-hover:translate-x-1.5 
			not-touch:group-hover:text-c-primary"
		/>
	{/if}
</a>
