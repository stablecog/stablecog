<script lang="ts">
	export let paddingX = 0;
	export let paddingY = 0;

	const rowCount = 20;
	const items = Array.from({ length: rowCount }, (_, i) => i);
</script>

<div style="padding: {paddingY}px {paddingX}px" class="flex h-full w-full flex-row">
	{#each items as item, index}
		<div class="aspect-square h-full p-px">
			<div class="h-full w-full rounded-md bg-c-bg-secondary" />
		</div>
	{/each}
</div>
