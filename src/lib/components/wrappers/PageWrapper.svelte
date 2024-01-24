<script lang="ts">
	export let noPadding = false;
	export { classes as class };
	let classes = '';
</script>

<div
	class="w-full flex-1 flex flex-col items-center px-6 md:px-12 {noPadding
		? ''
		: 'pt-6 md:pt-10 pb-4vh'} {classes}"
>
	<slot />
</div>
