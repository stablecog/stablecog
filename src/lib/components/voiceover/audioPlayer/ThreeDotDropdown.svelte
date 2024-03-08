<script lang="ts">
	import Morpher from '$components/utils/Morpher.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import { lgBreakpoint, xlBreakpoint } from '$components/generationFullScreen/constants';
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
	export let onDeleteClicked: (() => void) | undefined;

	const {
		elements: { trigger, content },
		states: { open }
	} = createPopover({
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
		? 'h-12 w-12'
		: 'h-10 w-10'} group/iconbutton relative flex items-center justify-center"
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
			class="h-6 w-6 transform text-c-on-bg/50 transition not-touch:group-hover/iconbutton:text-c-primary {$open
				? 'rotate-90'
				: ''}"
		/>
		<IconCancel
			slot="1"
			class="h-6 w-6 transform text-c-on-bg/50 transition not-touch:group-hover/iconbutton:text-c-primary {$open
				? 'rotate-90'
				: ''}"
		/>
	</Morpher>
</button>
{#if $open}
	<div
		transition:fly={{
			x: $windowWidth >= lgBreakpoint && $windowWidth < xlBreakpoint ? -16 : 16,
			opacity: 0,
			duration: 150,
			easing: quadOut
		}}
		class="flex rounded-md bg-c-bg-secondary shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary"
		{...$content}
		use:content
	>
		<CopyLinkButton {output} />
		<DownloadButton {output} afterDownload={() => open.set(false)} />
		{#if hasDeleteButton && onDeleteClicked}
			<DeleteButton
				onDeleteClicked={() => {
					open.set(false);
					if (onDeleteClicked) onDeleteClicked();
				}}
			/>
		{/if}
	</div>
{/if}
