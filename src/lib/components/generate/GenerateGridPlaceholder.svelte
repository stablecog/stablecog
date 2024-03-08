<script lang="ts">
	export let text: string;
</script>

<div class="flex h-full w-full flex-col items-start justify-start overflow-hidden p-1.5">
	<div class="flex h-full w-full flex-col items-stretch justify-start opacity-50">
		{#each Array(8) as item}
			<div class="flex w-full flex-1 flex-row">
				<div class="flex flex-1 p-2px">
					<div class="h-full w-full rounded-md bg-c-bg-secondary" />
				</div>
				<div class="flex flex-1 p-2px">
					<div class="h-full w-full rounded-md bg-c-bg-secondary" />
				</div>
				<div class="hidden flex-1 p-2px xl:flex">
					<div class="h-full w-full rounded-md bg-c-bg-secondary" />
				</div>
			</div>
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 flex h-full w-full flex-col items-center
    justify-center text-center text-sm text-c-on-bg/50"
	>
		<p
			class="relative w-full bg-c-bg px-8 py-4 shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] ring-2
			ring-c-bg-secondary md:lg:px-4 xl:px-8"
		>
			{text}
		</p>
	</div>
</div>
