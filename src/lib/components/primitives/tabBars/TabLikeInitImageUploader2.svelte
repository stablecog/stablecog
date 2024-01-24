<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconDropzone from '$components/icons/IconDropzone.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	import Morpher from '$components/utils/Morpher.svelte';
	import SliderInputWithNumerator from '$components/primitives/SliderInputWithNumerator.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import {
		initImageStrengthMax,
		initImageStrengthMin,
		initImageStrengthStep
	} from '$ts/constants/main';
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
	let classes = '';

	let fileInput: HTMLInputElement | undefined = undefined;
	let isImageModalOpen = false;
	let scrollY: number | undefined = undefined;
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
			'SC - User Id': $page.data.session?.user.id,
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
	<div class="flex-1 min-w-0 flex relative rounded-xl group">
		{#if $generationInitImageFilesState === 'idle' || $generationInitImageFilesState === 'error'}
			<div class="w-full h-full absolute left-0 top-0 overflow-hidden z-0 rounded-xl">
				<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
					<div
						class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
							bg-c-primary/10 {isDraggedInside ? 'opacity-100 translate-x-[-45%]' : ''} 
							not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
		{/if}
		{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
			<div class="w-full flex flex-col items-center relative">
				<div class="w-full flex justify-center items-center gap-3">
					<!-- Image container -->
					<div
						on:click|stopPropagation={openImageModal}
						on:keydown={() => null}
						bind:clientWidth={uploadImageContainerWidth}
						bind:clientHeight={uploadImageContainerHeight}
						class="bg-c-bg w-full h-22 bg-center transition hover:cursor-pointer flex items-center justify-center
						relative overflow-hidden rounded-t-xl z-0 ring-2 ring-c-bg-secondary
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
								class="bg-cover bg-center bg-no-repeat absolute top-0 left-1/2 transform -translate-x-1/2"
							/>
						{/if}
					</div>
					<!-- Uploading indicator -->
					{#if $generationInitImageFilesState === 'uploading' || $generationInitImageFilesState === 'uploaded' || $generationInitImageFilesState === 'error'}
						<div
							class="w-10 h-10 pointer-events-none p-1.5 bg-c-bg/75 rounded-tl-xl rounded-br-xl flex items-center justify-center absolute left-0 top-0"
						>
							<Morpher
								class="w-full h-full"
								morphed={$generationInitImageFilesState === 'uploaded' ||
									$generationInitImageFilesState === 'error'}
							>
								<div slot="0" class="w-full h-full transform scale-85">
									<IconAnimatedUploading
										loading={$generationInitImageFilesState === 'uploading'}
										class="w-full h-full text-c-on-bg"
									/>
								</div>
								<div class="w-full h-full" slot="1">
									<Morpher morphed={$generationInitImageFilesState === 'error'}>
										<div slot="0" class="w-full h-full">
											<IconTickOnly class="w-full h-full text-c-success" />
										</div>
										<div slot="1" class="w-full h-full">
											<IconWarningOutline class="w-full h-full text-c-danger" />
										</div>
									</Morpher>
								</div>
							</Morpher>
						</div>
					{/if}
				</div>
				{#if $generationInitImageFilesState === 'error'}
					<div class="w-full bg-c-bg-secondary h-2px" />
					<div
						class="w-full text-center leading-normal py-3 px-4 flex justify-center items-center text-sm text-c-danger
						relative pointer-events-none"
					>
						<p>{$LL.Error.TryAnotherImage()}</p>
					</div>
				{:else}
					<div class="w-full bg-c-bg-secondary h-2px" />
					<div class="w-full flex flex-col items-start mt-3">
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
								class="max-w-full px-4 text-c-on-bg/75 font-medium text-sm cursor-default"
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
							class="w-full px-4 gap-3"
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
			class="touch-manipulation flex items-center hover:cursor-pointer relative {$generationInitImageSrc &&
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
				accept={acceptedFileTypes.join(',')}
				bind:files={$generationInitImageFiles}
				{disabled}
				class="w-0 h-0 opacity-0"
			/>
			<div
				class="w-full max-w-full flex flex-col items-center justify-start px-4 pt-3 pb-3.5 gap-2"
			>
				<IconDropzone
					class="w-6 h-6 shrink-0 transition transform {isDraggedInside
						? 'text-c-primary scale-125'
						: 'text-c-on-bg/50'} not-touch:group-hover:text-c-primary"
				/>
				<p
					class="w-full text-center {isDraggedInside
						? 'text-c-primary'
						: 'text-c-on-bg/50'} text-sm font-normal min-w-0 flex-1 leading-normal transition
						not-touch:group-hover:text-c-primary"
				>
					{$LL.Home.ImageInput.Paragraph()}
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
		{#if $generationInitImageFilesState === 'error'}
			<button
				on:click={() => {
					resetUploadState();
					fileInput?.click();
				}}
				class="absolute w-full h-full left-0 top-0"
			/>
		{/if}
	</div>
	<!-- Delete image button -->
	{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
		<div class="h-full flex justify-end items-start absolute right-0 top-0 z-10">
			<div class="bg-c-bg/75 flex items-center justify-center rounded-tr-xl rounded-bl-xl">
				<IconButton name="Reset Upload State" class="p-0.5" onClick={resetUploadState}>
					<IconTrashcan
						class="w-5 h-5 transition not-touch:group-hover/iconbutton:text-c-primary"
					/>
				</IconButton>
			</div>
		</div>
	{/if}
</TabBarWrapper>

{#if isImageModalOpen && $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
	<div
		use:portal={'body'}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10001]"
	/>
	<div
		use:portal={'body'}
		on:scroll={onScroll}
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
								class="w-9 h-9 transition not-touch:group-hover/iconbutton:text-c-primary"
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
						<div
							class="absolute w-full flex flex-wrap justify-end items-center p-2 gap-2 md:p-3 md:gap-3"
						>
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
							<SubtleButton
								class="shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]"
								onClick={closeImageModal}
							>
								<IconCancel class="w-7 h-7" />
							</SubtleButton>
						</div>
						<img
							width={$generationInitImageWidth}
							height={$generationInitImageHeight}
							class="w-full h-auto bg-c-bg-secondary ring-4 ring-c-bg-secondary rounded-xl shadow-generation-modal shadow-c-shadow/[var(--o-shadow-stronger)]"
							src={$generationInitImageSrc}
							alt="Init"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
