<script lang="ts">
	import { page } from '$app/stores';
	import ModalWrapper from '$components/modals/ModalWrapper.svelte';
	import ShareCard from '$components/cards/ShareCard.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconShare from '$components/icons/IconShare.svelte';
	import LL from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		getPreviewImageUrlFromOutputId,
		getUserProfilePreviewImageUrlFromOutputId
	} from '$ts/helpers/getPreviewImageUrl';
	import { logShareModalOpened } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';

	export let modalType: TGenerationFullScreenModalType;
	export let url: string;
	export let generation: TGenerationWithSelectedOutput;
	export let portalBarrier: HTMLDivElement | undefined;
	export let portalContent: HTMLDivElement | undefined;

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
		logShareModalOpened({
			'SC - App Version': $appVersion,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - User Id': $page.data.session?.user.id,
			'SC - Output Id': generation.selected_output.id,
			'SC - Modal Type': modalType
		});
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
