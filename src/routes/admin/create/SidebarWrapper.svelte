<script lang="ts">
	export let rounding: 'all' | 'top' | 'bottom' = 'all';
</script>

<div
	class="w-full h-full flex flex-col bg-c-bg {rounding === 'top'
		? 'rounded-t-3xl'
		: rounding === 'bottom'
		? 'rounded-b-3xl'
		: 'rounded-3xl'} ring-4 ring-c-bg-secondary
  shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] overflow-hidden relative"
>
	<slot />
	<div
		class="w-full h-16 absolute z-10 -bottom-1 left-0 pointer-events-none 
		bg-gradient-to-t from-c-bg to-c-bg/0"
	/>
</div>
