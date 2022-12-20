<script lang="ts">
	export let type: 'bottom' | 'normal' = 'normal';
	export { classes as class };
	export let dontScale = false;
	let classes = '';
</script>

<div
	class="{type === 'bottom'
		? 'rounded-t-xl self-stretch shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)]'
		: 'rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]'} {dontScale
		? 'text-sm'
		: 'text-xs md:text-sm'} ring-2 ring-c-bg-secondary flex items-stretch  bg-c-bg transition relative {classes}"
>
	<slot />
</div>
