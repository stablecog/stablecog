<script lang="ts">
	type T = $$Generic;
	export let items: T[];
	export let cols = 4;
	export { classes as class };
	let classes = '';
</script>

<div class="w-full flex {classes}">
	{#each [...Array(cols).keys()] as columnIndex}
		<div style="width: {100 / cols}%" class="flex flex-col">
			{#each items.filter((_, index) => index % cols === columnIndex) as item}
				<slot {item} />
			{/each}
		</div>
	{/each}
</div>
