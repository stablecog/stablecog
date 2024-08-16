<script lang="ts">
	export let text: string;
	export let paddingX = 0;
	export let paddingY = 0;
</script>

<div style="padding: {paddingY}px {paddingX}px" class="relative h-full w-full">
	<div class="flex h-full w-full items-center justify-center opacity-50">
		{#each Array(10) as item}
			<div class="flex h-full flex-1 flex-col p-px">
				<div class="h-full flex-1 rounded-md bg-c-bg-secondary" />
			</div>
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 flex h-full w-full flex-col items-center
    justify-center text-center text-sm text-c-on-bg/50"
	>
		<p
			class="relative w-full break-words
			px-6 py-2 md:lg:px-4 xl:px-8"
		>
			{text}
		</p>
	</div>
</div>
