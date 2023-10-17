<script lang="ts">
	import { page } from '$app/stores';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
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
				outputIndex: generation.outputs.findIndex(
					(output) => output.id === generation.selected_output.id
				),
				modelId: generation.model_id,
				imageStrength: generation.prompt_strength
					? Math.round((1 - generation.prompt_strength) * 10) / 10
					: undefined,
				logProps: {
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Output Id': generation.selected_output.id,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - Generation Id': generation.id,
					'SC - User Id': $page.data.session?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
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
	class="touch-manipulation transition rounded-lg group/downloadbutton {classes}"
	aria-label="Download Image"
>
	<div
		class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0 after:w-full after:h-full after:absolute after:left-0 after:top-0
		after:-translate-x-full after:not-touch:group-hover/downloadbutton:translate-x-0
		after:rounded-full after:transition after:transform after:z-[-1] after:bg-c-primary"
	>
		<Morpher morphed={downloadStatus === 'downloading'} class="w-7 h-7">
			<IconDownload
				slot="0"
				class="w-7 h-7 transition text-c-on-bg relative
				not-touch:group-hover/downloadbutton:text-c-on-primary"
			/>
			<IconAnimatedSpinner
				slot="1"
				loading={downloadStatus === 'downloading'}
				class="w-7 h-7 text-c-on-bg relative
				not-touch:group-hover/downloadbutton:text-c-on-primary"
			/>
		</Morpher>
	</div>
</button>
