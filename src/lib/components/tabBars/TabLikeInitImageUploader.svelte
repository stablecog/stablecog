<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/buttons/IconButton.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconDropzone from '$components/icons/IconDropzone.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import RangeInputWithNumerator from '$components/RangeInputWithNumerator.svelte';
	import TabBarWrapper from '$components/tabBars/TabBarWrapper.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		initImageStrengthMax,
		initImageStrengthMin,
		initImageStrengthStep
	} from '$ts/constants/main';
	import { logInitImageRemoved } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		generationInitImageFiles,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageStrength,
		generationInitImageUrl,
		generationInitImageWidth
	} from '$ts/stores/generationSettings';
	import { isInitImageModalOpen } from '$ts/stores/isInitImageModalOpen';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowHeight } from '$ts/stores/window';
	import { portal } from 'svelte-portal';

	export let disabled = false;
	export let openSignInModal: () => void;
	export { classes as class };
	let classes = '';

	let fileInput: HTMLInputElement | undefined = undefined;
	let isImageModalOpen = false;
	let scrollY: number | undefined = undefined;

	function onKeyDown({ key }: KeyboardEvent) {
		if (!isImageModalOpen) return;
		if (key === 'Escape') {
			isImageModalOpen = false;
		}
	}

	function resetUploadState() {
		generationInitImageFiles.set(undefined);
		$generationInitImageSrc = undefined;
		$generationInitImageWidth = undefined;
		$generationInitImageHeight = undefined;
		isImageModalOpen = false;
		generationInitImageUrl.set(undefined);
		generationInitImageFilesState.set('idle');
		generationInitImageWidth.set(undefined);
		generationInitImageHeight.set(undefined);
		generationInitImageSrc.set(undefined);
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function removeInitImage() {
		logInitImageRemoved({
			'SC - User Id': $page.data.session?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - App Version': $appVersion
		});
		resetUploadState();
	}

	const closeImageModal = () => (isImageModalOpen = false);
	const openImageModal = () => (isImageModalOpen = true);

	$: isImageModalOpen, isInitImageModalOpen.set(isImageModalOpen);
</script>

<svelte:window on:keydown={onKeyDown} />

<TabBarWrapper class={classes}>
	<div class="self-stretch flex text-c-on-bg/50">
		<slot name="title" />
	</div>
	<div class="w-2px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<div class="flex-1 min-w-0 flex relative rounded-r-xl group">
		{#if $generationInitImageFilesState === 'idle' || $generationInitImageFilesState === 'error'}
			<div class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 rounded-r-xl">
				<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
					<div
						class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
							bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
					/>
				</div>
			</div>
		{/if}
		{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
			<div class="w-full flex items-center relative">
				<div class="p-1">
					<div
						on:click|stopPropagation={openImageModal}
						on:keydown={() => null}
						style="background-image: url({$generationInitImageSrc});"
						class="ml-px w-10.5 h-10.5 bg-cover bg-center rounded transition ring-2 ring-c-bg-secondary 
						shadow-md shadow-c-shadow/[var(--o-shadow-strongest)] hover:cursor-pointer {!$isTouchscreen
							? 'hover:ring-c-primary/75'
							: ''}"
					/>
				</div>
				{#if $generationInitImageFilesState === 'error'}
					<div
						on:click={() => {
							resetUploadState();
							fileInput?.click();
						}}
						on:keydown={() => null}
						class="flex-1 flex items-center self-stretch px-3 text-xs text-c-danger/75 relative cursor-pointer"
					>
						{$LL.Error.TryAnotherImage()}
					</div>
				{:else}
					<RangeInputWithNumerator
						min={initImageStrengthMin}
						max={initImageStrengthMax}
						step={initImageStrengthStep}
						numeratorFormatter={(value) => `${value * 100}%`}
						disabled={false}
						class="pl-2 pr-4 gap-3"
						bind:value={$generationInitImageStrength}
					/>
				{/if}
			</div>
		{/if}
		<label
			for="file-input"
			class="flex items-center hover:cursor-pointer relative {$generationInitImageSrc &&
			$generationInitImageWidth &&
			$generationInitImageHeight
				? 'opacity-0 w-0 h-0 overflow-hidden pointer-events-none'
				: 'opacity-100 w-full h-full'}"
		>
			<input
				bind:this={fileInput}
				id="file-input"
				name="file-input"
				type="file"
				accept="image/png, image/jpeg, image/webp"
				bind:files={$generationInitImageFiles}
				{disabled}
				class="w-0 h-0 opacity-0"
			/>
			<div
				class="max-w-full flex items-center justify-start pl-3.5 pr-4 py-3.25 md:py-3.5 gap-2 transition {!$isTouchscreen
					? 'group-hover:text-c-primary'
					: ''}"
			>
				<IconDropzone class="w-5 h-5 shrink-0" />
				<p
					class="text-base font-medium min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
				>
					{$LL.Home.ImageInput.Title()}
				</p>
			</div>
			{#if !$page.data.session?.user.id}
				<button
					on:click={openSignInModal}
					type="button"
					class="w-full h-full absolute left-0 top-0"
				/>
			{/if}
		</label>
	</div>
</TabBarWrapper>

{#if isImageModalOpen && $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
	<div
		use:portal={'body'}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10001]"
	/>
	<div
		use:portal={'body'}
		on:scroll={(e) => {
			scrollY = e.currentTarget.scrollTop;
		}}
		style="max-height: 100vh; max-height: {$windowHeight ? `${$windowHeight}px` : '100svh'};"
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 pb-20 md:p-16 z-[10002] overflow-auto"
	>
		<div class="w-full flex-1 md:h-full flex flex-col items-center md:min-h-[20rem]">
			<div class="w-full flex-1 md:max-w-full md:h-full flex flex-col items-center">
				<div
					class="w-full sticky top-0 z-10 flex items-center justify-start md:hidden px-1 pt-1 pb-2"
				>
					<div
						class="flex items-center justify-center transition duration-150 rounded-full {scrollY &&
						scrollY > 5
							? 'bg-c-bg-secondary/75'
							: 'bg-c-bg-secondary/0'}"
					>
						<IconButton name="Close" onClick={closeImageModal}>
							<IconCancel
								class="w-9 h-9 transition {!$isTouchscreen
									? 'group-hover/iconbutton:text-c-primary'
									: ''}"
							/>
						</IconButton>
					</div>
				</div>
				<div class="max-w-5xl flex-1 flex justify-center md:h-full w-full my-auto px-2.5">
					<div
						use:clickoutside={{ callback: closeImageModal }}
						style="aspect-ratio: {$generationInitImageWidth / $generationInitImageHeight}"
						class="w-full max-w-lg md:w-auto md:max-w-full md:max-h-full relative my-auto"
					>
						<div class="absolute w-full flex flex-wrap justify-end items-center p-3 gap-3">
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={() => fileInput?.click()}
							>
								<IconRefresh class="w-7 h-7" />
							</SubtleButton>
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={removeInitImage}
							>
								<IconTrashcan class="w-7 h-7 text-c-danger" />
							</SubtleButton>
						</div>
						<img
							width={$generationInitImageWidth}
							height={$generationInitImageHeight}
							class="w-full h-auto ring-4 ring-c-bg-secondary rounded-xl shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)]"
							src={$generationInitImageSrc}
							alt="Init"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
