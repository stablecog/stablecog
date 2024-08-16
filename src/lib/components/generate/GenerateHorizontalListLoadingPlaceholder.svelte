<script lang="ts">
	import ImagePlaceholder from '$components/utils/image/ImagePlaceholder.svelte';

	export let paddingX = 0;
	export let paddingY = 0;

	const rowCount = 20;
	const items = Array.from({ length: rowCount }, (_, i) => i);
</script>

<div style="padding: {paddingY}px {paddingX}px" class="flex h-full w-full flex-row">
	{#each items as item, index}
		<div class="p-px">
			<ImagePlaceholder
				width={512}
				height={512}
				class="h-full w-auto rounded-md bg-c-bg-secondary"
			/>
		</div>
	{/each}
</div>
