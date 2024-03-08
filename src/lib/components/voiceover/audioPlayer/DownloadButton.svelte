<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import LL from '$i18n/i18n-svelte';
	import { downloadVoicoverOutput } from '$ts/helpers/downloadVoiceoverOutput';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

	export let output: TVoiceoverFullOutput;
	export let size: 'md' | 'lg' | 'sm' = 'md';
	export let faded = false;
	export let disabled = false;
	export let afterDownload: (() => void) | undefined = undefined;

	let isDownloading = false;

	async function download() {
		if (isDownloading) return;
		isDownloading = true;
		try {
			await downloadVoicoverOutput(output);
			if (afterDownload) afterDownload();
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
	class="group/download-button relative touch-manipulation rounded-lg {size === 'lg'
		? 'h-12 w-12'
		: 'h-10 w-10'}"
	aria-label={$LL.Shared.DownloadButton()}
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/download-button:translate-x-0 not-touch:group-hover/download-button:translate-y-0 not-touch:group-hover/download-button:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="primary"
	/>
	<div class="p-2">
		<Morpher class="h-full w-full" morphed={isDownloading}>
			<div slot="0">
				<IconDownload
					class="h-full w-full transition {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
				/>
			</div>
			<div class="h-full w-full" slot="1">
				<IconAnimatedSpinner
					class="h-full w-full {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
					loading={isDownloading}
				/>
			</div>
		</Morpher>
	</div>
</button>
