<script lang="ts">
	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let noWrapper = false;
	export let hasGradient = false;
</script>

<div
	class="w-full h-full flex flex-col bg-c-bg {noWrapper
		? ''
		: rounding === 'top'
		? 'rounded-t-2xl'
		: rounding === 'bottom'
		? 'rounded-b-2xl'
		: 'rounded-2xl'} {noWrapper
		? ''
		: 'ring-2 ring-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)]'} z-0 overflow-hidden relative"
>
	<slot />
	{#if hasGradient}
		<div
			class="w-full h-20 absolute z-10 -bottom-1 left-0 pointer-events-none 
				bg-gradient-to-t from-c-bg to-c-bg/0"
		/>
	{/if}
</div>
