<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
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

	let downloadStatus: 'idle' | 'downloading' = 'idle';

	const downloadImage = async () => {
		downloadStatus = 'downloading';
		try {
			await downloadGenerationImage({
				url,
				prompt,
				seed,
				inferenceSteps,
				guidanceScale,
				isUpscaled
			});
		} catch (error) {
			console.log(error);
		}
		element.blur();
		downloadStatus = 'idle';
	};
</script>

<button
	bind:this={element}
	on:click={downloadImage}
	disabled={downloadStatus === 'downloading'}
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
		<Morpher morphed={downloadStatus === 'downloading'} class="w-7 h-7">
			<IconDownload
				slot="item-0"
				class="w-7 h-7 transition text-c-on-bg relative group-1-focus:text-c-on-primary {!$isTouchscreen
					? 'group-1-hover:text-c-on-primary'
					: ''}"
			/>
			<IconAnimatedSpinner
				slot="item-1"
				class="w-7 h-7 text-c-on-bg relative group-1-focus:text-c-on-primary {!$isTouchscreen
					? 'group-1-hover:text-c-on-primary'
					: ''}"
			/>
		</Morpher>
	</div>
</button>
