<script lang="ts">
	export let imageHeight: number;
	export let text: string;
</script>

<div class="w-full pt-2">
	<div style="height: {imageHeight}px" class="w-full flex items-center justify-center relative">
		<div
			class="w-full h-full opacity-60 flex flex-row items-center justify-center absolute left-0 top-0 gap-1 px-2 z-0"
		>
			{#each Array(10) as item}
				<div class="flex-1 h-full bg-c-bg-secondary rounded-md" />
			{/each}
		</div>
		<p
			class="w-full overflow-hidden px-6 whitespace-nowrap text-sm overflow-ellipsis text-center 
      text-c-on-bg/40 relative z-10"
		>
			{text}
		</p>
	</div>
</div>
