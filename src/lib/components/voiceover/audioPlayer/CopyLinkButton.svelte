<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import WithTooltip from '$components/WithTooltip.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { copyTimeoutDuration } from '$components/generationFullScreen/constants';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import { copy } from 'svelte-copy';

	export let output: TVoiceoverFullOutput;
	export let size: 'md' | 'lg' | 'sm' = 'md';
	export let faded = false;

	$: linkToCopy = output.video_file_url ?? output.audio_file_url;

	let copiedTimeout: NodeJS.Timeout;
	let closeTimeout: NodeJS.Timeout;
	let copied = false;

	function onCopied() {
		copied = true;
		clearTimeout(copiedTimeout);
		clearTimeout(closeTimeout);
		copiedTimeout = setTimeout(() => {
			copied = false;
		}, copyTimeoutDuration);
	}
</script>

<button
	use:copy={linkToCopy}
	on:svelte-copy={onCopied}
	on:svelte-copy:error={(e) => console.log(e)}
	class="touch-manipulation relative rounded-lg group/download-button transition {copied
		? 'bg-c-success'
		: 'bg-c-success/0'} {size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}"
	aria-label={$LL.Shared.CopyLinkButton()}
>
	{#if !copied}
		<ButtonHoverEffect
			groupClass="not-touch:group-hover/download-button:translate-x-0 not-touch:group-hover/download-button:translate-y-0 not-touch:group-hover/download-button:opacity-100"
			size={size === 'lg' ? 'md' : 'sm'}
			noPadding
			color="primary"
		/>
	{/if}
	<div class="p-2">
		<Morpher class="w-full h-full" morphed={copied}>
			<div slot="0">
				<IconLink
					class="w-full h-full transition {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
				/>
			</div>
			<div class="w-full h-full" slot="1">
				<IconTick class="text-c-bg transform scale-150" />
			</div>
		</Morpher>
	</div>
</button>
