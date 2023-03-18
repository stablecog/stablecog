<script lang="ts">
	import { page } from '$app/stores';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGenerationWithSelectedOutput;

	export { classes as class };
	let classes = '';

	let element: HTMLButtonElement;

	let downloadStatus: 'idle' | 'downloading' = 'idle';

	const downloadImage = async () => {
		downloadStatus = 'downloading';
		try {
			await downloadGenerationImage({
				url: generation.selected_output.upscaled_image_url
					? generation.selected_output.upscaled_image_url
					: generation.selected_output.image_url,
				prompt: generation.prompt.text,
				seed: generation.seed,
				inferenceSteps: generation.inference_steps,
				guidanceScale: generation.guidance_scale,
				isUpscaled: generation.selected_output.upscaled_image_url !== undefined,
				logProps: {
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Output Id': generation.selected_output.id,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - Generation Id': generation.id,
					'SC - Stripe Product Id': $userSummary?.product_id
				}
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
	class="transition rounded-lg group/downloadbutton {classes}"
	aria-label="Download Image"
>
	<div class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-full 
			bg-c-primary absolute left-0 top-0 group-focus/downloadbutton:translate-x-0 {!$isTouchscreen
				? 'group-hover/downloadbutton:translate-x-0'
				: ''}"
		/>
		<Morpher morphed={downloadStatus === 'downloading'} class="w-7 h-7">
			<IconDownload
				slot="item-0"
				class="w-7 h-7 transition text-c-on-bg relative group-focus/downloadbutton:text-c-on-primary {!$isTouchscreen
					? 'group-hover/downloadbutton:text-c-on-primary'
					: ''}"
			/>
			<IconAnimatedSpinner
				slot="item-1"
				class="w-7 h-7 text-c-on-bg relative group-focus/downloadbutton:text-c-on-primary {!$isTouchscreen
					? 'group-hover/downloadbutton:text-c-on-primary'
					: ''}"
			/>
		</Morpher>
	</div>
</button>
