<script lang="ts">
	export let text: string;
</script>

<div class="w-full h-full flex flex-col items-start justify-start overflow-hidden p-1.5">
	<div class="w-full h-full flex flex-col items-stretch justify-start opacity-50">
		{#each Array(8) as item}
			<div class="w-full flex flex-row flex-1">
				<div class="flex-1 flex p-2px">
					<div class="w-full h-full bg-c-bg-secondary rounded-md" />
				</div>
				<div class="flex-1 flex p-2px">
					<div class="w-full h-full bg-c-bg-secondary rounded-md" />
				</div>
				<div class="flex-1 p-2px hidden xl:flex">
					<div class="w-full h-full bg-c-bg-secondary rounded-md" />
				</div>
			</div>
		{/each}
	</div>
	<p
		class="absolute left-0 top-0 w-full h-full flex flex-col text-center py-5
    lg:px-4 xl:px-8 items-center justify-center text-c-on-bg/50 text-sm"
	>
		{text}
	</p>
</div>
