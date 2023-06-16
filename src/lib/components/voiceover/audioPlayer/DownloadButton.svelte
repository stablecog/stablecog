<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import { downloadVoicoverOutput } from '$ts/helpers/downloadVoiceoverOutput';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

	export let output: TVoiceoverFullOutput;
	export let size: 'md' | 'lg' | 'sm' = 'md';
	export let faded = false;
	export let disabled = false;

	let isDownloading = false;

	async function download() {
		if (isDownloading) return;
		isDownloading = true;
		try {
			await downloadVoicoverOutput(output);
		} catch (error) {
			console.log(error);
		} finally {
			isDownloading = false;
		}
	}
</script>

<button
	on:click={download}
	disabled={disabled || isDownloading}
	class="relative rounded-lg group/download-button {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/download-button:translate-x-0 not-touch:group-hover/download-button:translate-y-0 not-touch:group-hover/download-button:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="primary"
	/>
	<div class="p-2">
		<Morpher class="w-full h-full" morphed={isDownloading}>
			<div slot="0">
				<IconDownload
					class="w-full h-full transition {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
				/>
			</div>
			<div class="w-full h-full" slot="1">
				<IconAnimatedSpinner
					class="w-full h-full {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
					loading={isDownloading}
				/>
			</div>
		</Morpher>
	</div>
</button>
