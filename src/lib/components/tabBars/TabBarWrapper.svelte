<script lang="ts">
	export let type: 'bottom' | 'normal' = 'normal';
	export let dontScale = false;
	export { classes as class };
	let classes = '';
	export let outline: 'primary' | 'bg-secondary' | 'primary-strong' = 'bg-secondary';
</script>

<div
	class="{type === 'bottom'
		? 'rounded-t-xl self-stretch shadow-navbar shadow-c-shadow/[var(--o-shadow-stronger)]'
		: 'rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]'} {dontScale
		? 'text-sm'
		: 'text-sm'} {outline === 'primary-strong'
		? 'ring-c-primary/30'
		: outline === 'primary'
		? 'ring-c-primary/15'
		: 'ring-c-bg-secondary'} ring-2 flex items-stretch bg-c-bg transition relative {classes}"
>
	<slot />
</div>
