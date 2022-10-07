<script lang="ts">
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';

	export let prompt: string;
	export let width: number;
	export let height: number;
	export let seed: number;
	export let src: string;
	export let guidanceScale: number;
	export let inferenceSteps: number;
</script>

<img class="w-full h-full absolute left-0 top-0" {src} alt={prompt} {width} {height} />
<div
	class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end gap-5 overflow-auto"
>
	<div
		class="flex flex-col items-end justify-end right-0 top-0 transition transform 
		translate-x-16 group-focus-within:translate-x-0 group-hover:translate-x-0"
	>
		<DownloadGenerationButton
			class="p-2"
			url={src}
			{prompt}
			{seed}
			{guidanceScale}
			{inferenceSteps}
		/>
		<CopyButton class="p-2 -mt-2" stringToCopy={prompt} />
	</div>
	<div
		class="w-full max-h-[35%] min-h-[3.2rem] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0"
	>
		<div class="w-full max-h-full overflow-auto list-fade">
			<p class="w-full font-medium leading-normal transition text-c-on-bg px-5 py-4 transform">
				{prompt}
			</p>
		</div>
	</div>
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.25rem);
	}
</style>
