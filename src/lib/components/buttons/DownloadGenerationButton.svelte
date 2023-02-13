<script lang="ts">
	import IconDownload from '$components/icons/IconDownload.svelte';
	import { downloadGenerationImage } from '$ts/helpers/dowloadGenerationImage';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let url: string;
	export let prompt: string;
	export let seed: number;
	export let inferenceSteps: number;
	export let guidanceScale: number;
	export let isUpscaled: boolean;
	export { classes as class };
	let classes = '';

	let element: HTMLButtonElement;
</script>

<button
	bind:this={element}
	on:click={async () => {
		await downloadGenerationImage({
			url,
			prompt,
			seed,
			inferenceSteps,
			guidanceScale,
			isUpscaled
		});
		element.blur();
	}}
	class="transition rounded-lg group-1 {classes}"
	aria-label="Download Image"
>
	<div class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-full 
			bg-c-primary absolute left-0 top-0 group-1-focus:translate-x-0 {!$isTouchscreen
				? 'group-1-hover:translate-x-0'
				: ''}"
		/>
		<IconDownload
			class="w-7 h-7 transition text-c-on-bg relative group-1-focus:text-c-on-primary {!$isTouchscreen
				? 'group-1-hover:text-c-on-primary'
				: ''}"
		/>
	</div>
</button>
