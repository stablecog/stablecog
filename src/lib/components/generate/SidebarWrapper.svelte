<script lang="ts">
	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let borderSize: 'none' | 'sm' | 'md' = 'md';
	export let noWrapper = false;
	export let hasGradient = false;
	export let horizontal = false;
</script>

<div
	class="flex w-full flex-1 flex-col bg-c-bg {borderSize === 'none'
		? ''
		: rounding === 'top'
			? borderSize === 'sm'
				? 'rounded-t-xl'
				: 'rounded-t-2xl'
			: rounding === 'bottom'
				? borderSize === 'sm'
					? 'rounded-b-xl'
					: 'rounded-b-2xl'
				: borderSize === 'sm'
					? 'rounded-xl'
					: 'rounded-2xl'} {noWrapper
		? ''
		: 'shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary'} 
		{horizontal ? 'items-center' : ''} relative z-0 overflow-hidden"
>
	<slot />
	{#if hasGradient}
		<div
			class="translate-3d-0 pointer-events-none absolute -bottom-1 left-0 h-12
				w-full bg-gradient-to-t from-c-bg to-c-bg/0"
		/>
	{/if}
</div>
