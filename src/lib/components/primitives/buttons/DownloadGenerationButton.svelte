<script lang="ts">
	import { page } from '$app/stores';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { downloadGenerationImage } from '$ts/helpers/downloadGenerationImage';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';

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
					'SC - Locale': $locale,
					'SC - Output Id': generation.selected_output.id,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - Generation Id': generation.id,
					'SC - User Id': $sessionStore?.user.id,
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
	class="group/downloadbutton relative z-0 touch-manipulation overflow-hidden rounded-full bg-c-bg p-2.5 transition
	before:absolute before:left-0 before:top-0 before:h-full before:w-full
	before:-translate-x-full before:transform
	before:rounded-full before:bg-c-primary before:transition before:not-touch:hover:translate-x-0 {classes}"
	aria-label="Download Image"
>
	<Morpher morphed={downloadStatus === 'downloading'} class="h-7 w-7">
		<IconDownload
			slot="0"
			class="relative h-7 w-7 text-c-on-bg transition
				not-touch:group-hover/downloadbutton:text-c-on-primary"
		/>
		<IconAnimatedSpinner
			slot="1"
			loading={downloadStatus === 'downloading'}
			class="relative h-7 w-7 text-c-on-bg
				not-touch:group-hover/downloadbutton:text-c-on-primary"
		/>
	</Morpher>
</button>
