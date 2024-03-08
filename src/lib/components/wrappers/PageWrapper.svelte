<script lang="ts">
	export let noPadding = false;
	export { classes as class };
	let classes = '';
</script>

<div
	class="flex w-full flex-1 flex-col items-center px-6 md:px-12 {noPadding
		? ''
		: 'pb-4vh pt-6 md:pt-10'} {classes}"
>
	<slot />
</div>
