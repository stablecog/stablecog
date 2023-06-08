<script lang="ts">
	export let text: string;
</script>

<div class="w-full h-full flex flex-col overflow-hidden">
	<div class="w-full flex flex-col opacity-50 gap-6px p-6px">
		{#each Array.from({ length: 20 }) as item}
			<div class="w-full h-[84px] bg-c-bg-secondary rounded-xl" />
		{/each}
	</div>
	<div
		class="absolute left-0 top-0 w-full h-full flex flex-col text-center
    items-center justify-center text-c-on-bg/50 text-sm"
	>
		<p
			class="w-full relative py-5 lg:px-4 xl:px-8 bg-c-bg ring-2
      ring-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			{text}
		</p>
	</div>
</div>
