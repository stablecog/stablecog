<script lang="ts">
	export let text: string;
</script>

<div class="w-full h-full relative px-2 py-1.5">
	<div class="w-full h-full flex items-center justify-center gap-1">
		{#each Array(10) as item}
			<div class="flex-1 h-full bg-c-bg-secondary rounded-md" />
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 w-full h-full flex flex-col text-center
    items-center justify-center text-c-on-bg/50 text-sm"
	>
		<p
			class="w-full whitespace-nowrap overflow-hidden overflow-ellipsis relative
			py-2 px-8 md:lg:px-4 xl:px-8"
		>
			{text}
		</p>
	</div>
</div>
