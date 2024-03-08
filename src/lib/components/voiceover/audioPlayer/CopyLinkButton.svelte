<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import { copyTimeoutDuration } from '$components/generationFullScreen/constants';
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
	class="group/download-button relative touch-manipulation rounded-lg transition {copied
		? 'bg-c-success'
		: 'bg-c-success/0'} {size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'}"
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
		<Morpher class="h-full w-full" morphed={copied}>
			<div slot="0">
				<IconLink
					class="h-full w-full transition {faded
						? 'text-c-on-bg/50'
						: 'text-c-on-bg'} not-touch:group-hover/download-button:text-c-primary"
				/>
			</div>
			<div class="h-full w-full" slot="1">
				<IconTick class="scale-150 transform text-c-bg" />
			</div>
		</Morpher>
	</div>
</button>
