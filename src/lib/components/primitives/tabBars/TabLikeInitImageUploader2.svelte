<script lang="ts">
	import { page } from '$app/stores';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconDropzone from '$components/icons/IconDropzone.svelte';
	import IconNoImageOutline from '$components/icons/IconNoImageOutline.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import SliderInputWithNumerator from '$components/primitives/SliderInputWithNumerator.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		initImageStrengthMax,
		initImageStrengthMin,
		initImageStrengthStep
	} from '$ts/constants/main';
	import { sessionStore } from '$ts/constants/supabase';
	import { logInitImageRemoved } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		generationHeight,
		generationInitImageFiles,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageStrength,
		generationInitImageUrl,
		generationInitImageWidth,
		generationWidth
	} from '$ts/stores/generationSettings';
	import { isInitImageModalOpen } from '$ts/stores/isInitImageModalOpen';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowHeight } from '$ts/stores/window';
	import { portal } from 'svelte-portal';

	export let disabled = false;
	export let openSignInModal: () => void;
	export { classes as class };
	export let notSupported = false;
	let classes = '';

	let fileInput: HTMLInputElement | undefined = undefined;
	let isImageModalOpen = false;
	const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/webp'];
	let isDraggedInside = false;
	let uploadImageContainerWidth: number;
	let uploadImageContainerHeight: number;
	let uploadImageInnerContainerWidth: number;
	let uploadImageInnerContainerHeight: number;
	const animationDuration = 0.15;
	const animationEasing = 'cubic-bezier(0.45, 0, 0.55, 1)';

	$: [$generationWidth, $generationHeight, uploadImageContainerWidth, uploadImageContainerHeight],
		setUploadImageInnerDimensions();

	function setUploadImageInnerDimensions() {
		if (
			!$generationWidth ||
			!$generationHeight ||
			!uploadImageContainerWidth ||
			!uploadImageContainerHeight
		) {
			return;
		}
		const boundByHeight =
			uploadImageContainerHeight / Number($generationHeight) <
			uploadImageContainerWidth / Number($generationWidth);
		if (boundByHeight) {
			uploadImageInnerContainerHeight = uploadImageContainerHeight;
			uploadImageInnerContainerWidth =
				(uploadImageContainerHeight / Number($generationHeight)) * Number($generationWidth);
		} else {
			uploadImageInnerContainerWidth = uploadImageContainerWidth;
			uploadImageInnerContainerHeight =
				(uploadImageContainerWidth / Number($generationWidth)) * Number($generationHeight);
		}
	}
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
		isDraggedInside = false;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function removeInitImage() {
		logInitImageRemoved({
			'SC - User Id': $sessionStore?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - Locale': $locale,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - App Version': $appVersion
		});
		resetUploadState();
	}

	const closeImageModal = () => (isImageModalOpen = false);
	const openImageModal = () => (isImageModalOpen = true);

	$: isImageModalOpen, isInitImageModalOpen.set(isImageModalOpen);

	function makeSingleItemFileListFromFileList(fileList: FileList) {
		const file = fileList[0];
		const singleItemFileList = new DataTransfer();
		singleItemFileList.items.add(file);
		return singleItemFileList.files;
	}

	function setFilesIfValid(
		e: DragEvent & {
			currentTarget: EventTarget & HTMLLabelElement;
		}
	) {
		if (!fileInput || !e.dataTransfer) {
			isDraggedInside = false;
			return;
		}
		const files = makeSingleItemFileListFromFileList(e.dataTransfer.files);
		if (files.length === 0 || !acceptedFileTypes.includes(files[0].type)) {
			isDraggedInside = false;
			return;
		}
		fileInput.files = files;
		generationInitImageFiles.set(files);
		isDraggedInside = false;
	}

	function onDrop(e: any) {
		setFilesIfValid(e);
	}

	function onScroll(e: any) {
		scrollY = e.currentTarget.scrollTop;
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<TabBarWrapper class={classes} outline={isDraggedInside ? 'primary-strong' : undefined}>
	{#if notSupported}
		<div class="group relative flex min-w-0 flex-1 cursor-not-allowed rounded-xl">
			<div
				class="flex w-full max-w-full flex-col items-center justify-start gap-2 px-4 pb-3.5 pt-3"
			>
				<IconNoImageOutline class="h-6 w-6 shrink-0 transform text-c-on-bg/50 transition" />
				<p
					class="w-full min-w-0 flex-1 text-center text-sm font-normal leading-normal text-c-on-bg/50 transition"
				>
					{$LL.Home.ImageInput.NotSupported()}
				</p>
			</div>
		</div>
	{:else}
		<div class="group relative flex min-w-0 flex-1 rounded-xl">
			{#if $generationInitImageFilesState === 'idle' || $generationInitImageFilesState === 'error'}
				<div class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden rounded-xl">
					<div class="absolute left-0 top-0 flex h-full w-[200%] items-center justify-center">
						<div
							class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/10 opacity-0
								transition {isDraggedInside ? 'translate-x-[-45%] opacity-100' : ''} 
								not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
						/>
					</div>
				</div>
			{/if}
			{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
				<div class="relative flex w-full flex-col items-center">
					<div class="flex w-full items-center justify-center gap-3">
						<!-- Image container -->
						<div
							on:click|stopPropagation={openImageModal}
							on:keydown={() => null}
							bind:clientWidth={uploadImageContainerWidth}
							bind:clientHeight={uploadImageContainerHeight}
							class="relative z-0 flex h-22 w-full items-center justify-center overflow-hidden rounded-t-xl
							bg-c-bg bg-center ring-2 ring-c-bg-secondary transition hover:cursor-pointer
							not-touch:hover:ring-c-primary/25"
							role="button"
							tabindex="0"
						>
							{#if uploadImageContainerWidth && uploadImageContainerHeight}
								<div
									style="
										background-image: url({$generationInitImageSrc});
										width: {uploadImageInnerContainerWidth}px;
										height: {uploadImageInnerContainerHeight}px;
										transition:
											width {animationDuration}s {animationEasing},
											height {animationDuration}s {animationEasing};
										"
									class="absolute left-1/2 top-0 -translate-x-1/2 transform bg-cover bg-center bg-no-repeat"
								/>
							{/if}
						</div>
						<!-- Uploading indicator -->
						{#if $generationInitImageFilesState === 'uploading' || $generationInitImageFilesState === 'uploaded' || $generationInitImageFilesState === 'error'}
							<div
								class="pointer-events-none absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-br-xl rounded-tl-xl bg-c-bg/75 p-1.5"
							>
								<Morpher
									class="h-full w-full"
									morphed={$generationInitImageFilesState === 'uploaded' ||
										$generationInitImageFilesState === 'error'}
								>
									<div slot="0" class="h-full w-full scale-85 transform">
										<IconAnimatedUploading
											loading={$generationInitImageFilesState === 'uploading'}
											class="h-full w-full text-c-on-bg"
										/>
									</div>
									<div class="h-full w-full" slot="1">
										<Morpher morphed={$generationInitImageFilesState === 'error'}>
											<div slot="0" class="h-full w-full">
												<IconTickOnly class="h-full w-full text-c-success" />
											</div>
											<div slot="1" class="h-full w-full">
												<IconWarningOutline class="h-full w-full text-c-danger" />
											</div>
										</Morpher>
									</div>
								</Morpher>
							</div>
						{/if}
					</div>
					{#if $generationInitImageFilesState === 'error'}
						<div class="h-2px w-full bg-c-bg-secondary" />
						<div
							class="pointer-events-none relative flex w-full items-center justify-center px-4 py-3 text-center text-sm
							leading-normal text-c-danger"
						>
							<p>{$LL.Error.TryAnotherImage()}</p>
						</div>
					{:else}
						<div class="h-2px w-full bg-c-bg-secondary" />
						<div class="mt-3 flex w-full flex-col items-start">
							<WithTooltip
								let:trigger
								let:triggerStoreValue
								title={$LL.Home.InitialImageStrengthTabBar.TitleAlt()}
								paragraph={$LL.Home.InitialImageStrengthTabBar.Paragraph()}
							>
								<p
									tabindex="-1"
									use:trigger
									{...triggerStoreValue}
									class="max-w-full cursor-default px-4 text-sm font-medium text-c-on-bg/75"
								>
									{$LL.Home.InitialImageStrengthTabBar.TitleAlt()}
								</p>
							</WithTooltip>
							<SliderInputWithNumerator
								name={$LL.Home.InitialImageStrengthTabBar.Title()}
								min={initImageStrengthMin}
								max={initImageStrengthMax}
								step={initImageStrengthStep}
								numeratorFormatter={(value) => `${value}%`}
								disabled={false}
								class="w-full gap-3 px-4"
								bind:value={$generationInitImageStrength}
							/>
						</div>
					{/if}
				</div>
			{/if}
			<label
				on:dragenter|preventDefault|stopPropagation={() => (isDraggedInside = true)}
				on:dragleave|preventDefault|stopPropagation={() => (isDraggedInside = false)}
				on:dragend|preventDefault|stopPropagation={() => (isDraggedInside = false)}
				on:dragover|preventDefault|stopPropagation={() => (isDraggedInside = true)}
				on:drop|preventDefault|stopPropagation={onDrop}
				for="file-input"
				class="relative flex touch-manipulation items-center hover:cursor-pointer {$generationInitImageSrc &&
				$generationInitImageWidth &&
				$generationInitImageHeight
					? 'pointer-events-none h-0 w-0 overflow-hidden opacity-0'
					: 'h-full w-full opacity-100'}"
			>
				<input
					bind:this={fileInput}
					id="file-input"
					name="file-input"
					type="file"
					accept={acceptedFileTypes.join(',')}
					bind:files={$generationInitImageFiles}
					{disabled}
					class="h-0 w-0 opacity-0"
				/>
				<div
					class="flex w-full max-w-full flex-col items-center justify-start gap-2 px-4 pb-3.5 pt-3"
				>
					<IconDropzone
						class="h-6 w-6 shrink-0 transform transition {isDraggedInside
							? 'scale-125 text-c-primary'
							: 'text-c-on-bg/50'} not-touch:group-hover:text-c-primary"
					/>
					<p
						class="w-full text-center {isDraggedInside
							? 'text-c-primary'
							: 'text-c-on-bg/50'} min-w-0 flex-1 text-sm font-normal leading-normal transition
							not-touch:group-hover:text-c-primary"
					>
						{$LL.Home.ImageInput.Paragraph()}
					</p>
				</div>
				{#if !$sessionStore?.user.id}
					<button
						on:click={openSignInModal}
						type="button"
						class="absolute left-0 top-0 h-full w-full"
					/>
				{/if}
			</label>
			{#if $generationInitImageFilesState === 'error'}
				<button
					on:click={() => {
						resetUploadState();
						fileInput?.click();
					}}
					class="absolute left-0 top-0 h-full w-full"
				/>
			{/if}
		</div>
		<!-- Delete image button -->
		{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
			<div class="absolute right-0 top-0 z-10 flex h-full items-start justify-end">
				<div class="flex items-center justify-center rounded-bl-xl rounded-tr-xl bg-c-bg/75">
					<IconButton name="Reset Upload State" class="p-0.5" onClick={resetUploadState}>
						<IconTrashcan
							class="h-5 w-5 transition not-touch:group-hover/iconbutton:text-c-primary"
						/>
					</IconButton>
				</div>
			</div>
		{/if}
	{/if}
</TabBarWrapper>

{#if isImageModalOpen && $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
	<div
		use:portal={'body'}
		class="fixed left-0 top-0 z-[10001] h-full w-full bg-c-barrier/80 px-3"
	/>
	<div
		use:portal={'body'}
		on:scroll={onScroll}
		style="max-height: 100vh; max-height: {$windowHeight ? `${$windowHeight}px` : '100svh'};"
		class="fixed left-0 top-0 z-[10002] flex h-full w-full flex-col items-center overflow-auto py-16 md:p-16"
	>
		<div class="flex w-full flex-1 flex-col items-center md:h-full md:min-h-[20rem]">
			<div class="flex w-full flex-1 flex-col items-center md:h-full md:max-w-full">
				<div class="my-auto flex w-full max-w-5xl flex-1 justify-center px-2.5 md:h-full">
					<div
						use:clickoutside={{ callback: closeImageModal }}
						style="aspect-ratio: {$generationInitImageWidth / $generationInitImageHeight}"
						class="relative my-auto w-full max-w-lg md:max-h-full md:w-auto md:max-w-full"
					>
						<div
							class="absolute flex w-full flex-wrap items-center justify-end gap-2 p-2 md:gap-3 md:p-3"
						>
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={() => fileInput?.click()}
							>
								<IconRefresh class="h-7 w-7" />
							</SubtleButton>
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={removeInitImage}
							>
								<IconTrashcan class="h-7 w-7 text-c-danger" />
							</SubtleButton>
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={closeImageModal}
							>
								<IconCancel class="h-7 w-7" />
							</SubtleButton>
						</div>
						<img
							width={$generationInitImageWidth}
							height={$generationInitImageHeight}
							class="h-auto w-full rounded-xl bg-c-bg-secondary shadow-generation-modal shadow-c-shadow/[var(--o-shadow-stronger)] ring-4 ring-c-bg-secondary"
							src={$generationInitImageSrc}
							alt="Init"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
