<script lang="ts">
	import ShareCard from '$components/ShareCard.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconShare from '$components/icons/IconShare.svelte';
	import LL from '$i18n/i18n-svelte';
	import {
		getPreviewImageUrlFromOutputId,
		getUserProfilePreviewImageUrlFromOutputId
	} from '$ts/helpers/getPreviewImageUrl';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { createDialog } from '@melt-ui/svelte';

	export let modalType: TGenerationFullScreenModalType;
	export let url: string;
	export let generation: TGenerationWithSelectedOutput;
	export let portalElement: HTMLElement;

	const {
		elements: { trigger, close, content, overlay, portalled, title },
		states: { open }
	} = createDialog();
</script>

<SubtleButton
	{trigger}
	onClick={() => {
		fetch(
			modalType === 'user-profile' ||
				modalType === 'history' ||
				modalType === 'stage' ||
				modalType === 'generate'
				? getUserProfilePreviewImageUrlFromOutputId(
						generation.selected_output.id,
						generation.user.username
				  )
				: getPreviewImageUrlFromOutputId(generation.selected_output.id)
		);
	}}
>
	<div class="flex items-center justify-center gap-1.5">
		<IconShare class="w-5 h-5 -ml-0.5" />
		<p>{$LL.Shared.ShareButton()}</p>
	</div>
</SubtleButton>

{#if $open}
	<div {...$portalled} use:portalled bind:this={portalElement}>
		{#if $open}
			<div {...$overlay} use:overlay class="fixed inset-0 z-[9999] w-full h-full bg-c-barrier/80" />
			<div
				class="w-full h-full fixed inset-0 z-[10000] flex justify-center px-3 pt-8 pb-12 overflow-auto"
			>
				<ShareCard class="my-auto" {generation} {url} {title} {close} {content} />
			</div>
		{/if}
	</div>
{/if}
