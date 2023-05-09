<script lang="ts">
	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let borderSize: 'none' | 'sm' | 'md' = 'md';
	export let noWrapper = false;
	export let hasGradient = false;
</script>

<div
	class="w-full flex-1 flex flex-col bg-c-bg {borderSize === 'none'
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
		: 'ring-2 ring-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)]'} z-0 overflow-hidden relative"
>
	<slot />
	{#if hasGradient}
		<div
			class="w-full h-20 absolute z-10 -bottom-1 left-0 pointer-events-none
				bg-gradient-to-t from-c-bg to-c-bg/0 translate-3d-0"
		/>
	{/if}
</div>
