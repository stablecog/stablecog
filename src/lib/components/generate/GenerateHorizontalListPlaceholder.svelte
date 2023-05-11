<script lang="ts">
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	export let text: string;

	let containerHeight: number;
</script>

<div class="w-full h-full relative px-2 py-1.5">
	<div class="w-full h-full relative">
		<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full h-full opacity-60 flex flex-row items-center justify-center absolute left-0 top-0 gap-1 z-0"
			>
				{#each Array(10) as item}
					<div class="flex-1 h-full bg-c-bg-secondary rounded-md" />
				{/each}
			</div>
			<div class="w-full h-full flex items-center justify-center overflow-hidden px-4">
				<p
					class="w-full whitespace-nowrap overflow-hidden
					text-sm overflow-ellipsis text-center text-c-on-bg/40 relative z-10"
				>
					{text}
				</p>
			</div>
		</div>
	</div>
</div>
