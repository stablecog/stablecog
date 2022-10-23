<script lang="ts">
	export let type: 'bottom' | 'normal' = 'normal';
	export { classes as class };
	let classes = '';
</script>

<div
	class="{type === 'bottom'
		? 'rounded-t-xl self-stretch shadow-navbar shadow-c-shadow/[var(--o-shadow-strongest)]'
		: 'rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] '} w-full flex items-stretch text-xs md:text-sm bg-c-bg
		ring-2 ring-c-bg-secondary transition relative {classes}"
>
	<slot />
</div>
