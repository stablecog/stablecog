<script lang="ts">
	import Morpher from '$components/Morpher.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconThreeDots from '$components/icons/IconThreeDots.svelte';
	import CopyLinkButton from '$components/voiceover/audioPlayer/CopyLinkButton.svelte';
	import DeleteButton from '$components/voiceover/audioPlayer/DeleteButton.svelte';
	import DownloadButton from '$components/voiceover/audioPlayer/DownloadButton.svelte';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import { createPopover } from '@melt-ui/svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let output: TVoiceoverFullOutput;
	export let size: 'md' | 'lg' | 'sm' = 'md';

	const { trigger, content, open, arrow, close } = createPopover({
		positioning: {
			placement: 'left'
		}
	});
</script>

<button
	{...$trigger}
	use:trigger
	aria-label="More Options"
	class="{size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'} flex items-center justify-center"
>
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
		transition:fly={{ x: 10, opacity: 0, duration: 200, easing: quadOut }}
		class="bg-c-bg-secondary shadow-xl shadow-c-bg-secondary rounded-lg flex"
		{...$content}
		use:content
	>
		<CopyLinkButton {output} />
		<DownloadButton {output} />
		<DeleteButton {output} />
	</div>
{/if}
