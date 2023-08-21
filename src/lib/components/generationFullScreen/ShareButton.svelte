<script lang="ts">
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import ShareCard from '$components/ShareCard.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconShare from '$components/icons/IconShare.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		getPreviewImageUrlFromOutputId,
		getUserProfilePreviewImageUrlFromOutputId
	} from '$ts/helpers/getPreviewImageUrl';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	export let modalType: TGenerationFullScreenModalType;
	export let url: string;
	export let generation: TGenerationWithSelectedOutput;
	export let portalBarrier: HTMLDivElement;
	export let portalContent: HTMLDivElement;

	let isModalOpen = false;

	const closeModal = () => (isModalOpen = false);
</script>

<SubtleButton
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
		isModalOpen = !isModalOpen;
	}}
>
	<div class="flex items-center justify-center gap-1.5">
		<IconShare class="w-5 h-5 -ml-0.5" />
		<p>{$LL.Shared.ShareButton()}</p>
	</div>
</SubtleButton>

{#if isModalOpen}
	<ModalWrapper
		level={1}
		overflowHiddenClass="overflow-hidden-for-modal-l1"
		bind:portalBarrier
		bind:portalContent
	>
		<div use:clickoutside={{ callback: closeModal }} class="max-w-full my-auto">
			<ShareCard {generation} {url} close={closeModal} />
		</div>
	</ModalWrapper>
{/if}
