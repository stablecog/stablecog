<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xlBreakpoint
	} from '$components/generationFullScreen/constants';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconThreeDots from '$components/icons/IconThreeDots.svelte';
	import CopyLinkButton from '$components/voiceover/audioPlayer/CopyLinkButton.svelte';
	import DeleteButton from '$components/voiceover/audioPlayer/DeleteButton.svelte';
	import DownloadButton from '$components/voiceover/audioPlayer/DownloadButton.svelte';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import { windowWidth } from '$ts/stores/window';
	import { createPopover } from '@melt-ui/svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let output: TVoiceoverFullOutput;
	export let size: 'md' | 'lg' | 'sm' = 'md';
	export let hasDeleteButton = false;

	const { trigger, content, open, arrow, close } = createPopover({
		positioning: {
			placement: 'left',
			gutter: 4
		}
	});
</script>

<button
	{...$trigger}
	use:trigger
	aria-label="More Options"
	class="{size === 'lg'
		? 'w-12 h-12'
		: 'w-10 h-10'} flex items-center justify-center group/iconbutton relative"
>
	<ButtonHoverEffect
		groupClass="not-touch:group-hover/iconbutton:translate-x-0 not-touch:group-hover/iconbutton:translate-y-0 not-touch:group-hover/iconbutton:opacity-100"
		size={size === 'lg' ? 'md' : 'sm'}
		noPadding
		color="primary"
	/>
	<Morpher morphed={$open}>
		<IconThreeDots
			slot="0"
			class="w-6 h-6 text-c-on-bg/50 not-touch:group-hover/iconbutton:text-c-primary transition transform {$open
				? 'rotate-90'
				: ''}"
		/>
		<IconCancel
			slot="1"
			class="w-6 h-6 text-c-on-bg/50 not-touch:group-hover/iconbutton:text-c-primary transition transform {$open
				? 'rotate-90'
				: ''}"
		/>
	</Morpher>
</button>
{#if $open}
	<div
		transition:fly={{
			x: $windowWidth >= lgBreakpoint && $windowWidth < xlBreakpoint ? -48 : 48,
			opacity: 0,
			duration: 200,
			easing: quadOut
		}}
		class="bg-c-bg-secondary ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] rounded-md flex"
		{...$content}
		use:content
	>
		<CopyLinkButton {output} />
		<DownloadButton {output} afterDownload={() => open.set(false)} />
		{#if hasDeleteButton}
			<DeleteButton {output} />
		{/if}
	</div>
{/if}
