<script lang="ts">
	type T = $$Generic;
	export let items: T[];
	export let cols = 4;
</script>

<div class="w-full flex">
	{#each [...Array(cols).keys()] as columnIndex}
		<div style="width: {100 / cols}%" class="flex flex-col">
			{#each items.filter((_, index) => index % cols === columnIndex) as item}
				<div class="w-full">
					<slot {item} />
				</div>
			{/each}
		</div>
	{/each}
</div>
