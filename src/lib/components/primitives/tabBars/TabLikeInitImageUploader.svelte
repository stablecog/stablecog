<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconDropzone from '$components/icons/IconDropzone.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import SliderInputWithNumerator from '$components/primitives/SliderInputWithNumerator.svelte';
	import TabBarWrapper from '$components/primitives/tabBars/TabBarWrapper.svelte';
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
		generationInitImageFiles,
		generationInitImageFilesState,
		generationInitImageHeight,
		generationInitImageSrc,
		generationInitImageStrength,
		generationInitImageUrl,
		generationInitImageWidth
	} from '$ts/stores/generationSettings';
	import { isInitImageModalOpen } from '$ts/stores/isInitImageModalOpen';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowHeight } from '$ts/stores/window';
	import { portal } from 'svelte-portal';
	import { sessionStore } from '$ts/constants/supabase';

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
</script>

<svelte:window on:keydown={onKeyDown} />

<TabBarWrapper class={classes}>
	<div class="flex self-stretch text-c-on-bg/50">
		<slot name="title" />
	</div>
	<div class="-ml-px w-2px self-stretch">
		<div class="h-full w-full bg-c-bg-secondary" />
	</div>
	<div class="group relative flex min-w-0 flex-1 rounded-r-xl">
		{#if $generationInitImageFilesState === 'idle' || $generationInitImageFilesState === 'error'}
			<div class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden rounded-r-xl">
				<div class="absolute left-0 top-0 flex h-full w-[200%] items-center justify-center">
					<div
						class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/10 opacity-0
							transition not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
		{/if}
		{#if $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
			<div class="relative flex w-full items-center">
				<div class="p-1">
					<div
						role="button"
						tabindex="0"
						aria-label="Open Image Modal"
						on:click|stopPropagation={openImageModal}
						on:keydown={() => null}
						style="background-image: url({$generationInitImageSrc});"
						class="ml-px h-10.5 w-10.5 rounded bg-c-bg-secondary bg-cover bg-center shadow-md shadow-c-shadow/[var(--o-shadow-strongest)] ring-2
						ring-c-bg-secondary transition hover:cursor-pointer
						not-touch:hover:ring-c-primary/75"
					/>
				</div>
				{#if $generationInitImageFilesState === 'error'}
					<div
						role="button"
						tabindex="0"
						aria-label="Try Another Image"
						on:click={() => {
							resetUploadState();
							fileInput?.click();
						}}
						on:keydown={() => null}
						class="relative flex flex-1 cursor-pointer items-center self-stretch px-3 text-xs text-c-danger/75"
					>
						{$LL.Error.TryAnotherImage()}
					</div>
				{:else}
					<SliderInputWithNumerator
						name={$LL.Home.InitialImageStrengthTabBar.Title()}
						min={initImageStrengthMin}
						max={initImageStrengthMax}
						step={initImageStrengthStep}
						numeratorFormatter={(value) => `${value * 100}%`}
						disabled={false}
						class="gap-3 pl-2 pr-4"
						bind:value={$generationInitImageStrength}
					/>
				{/if}
			</div>
		{/if}
		<label
			for="file-input"
			class="relative flex items-center hover:cursor-pointer {$generationInitImageSrc &&
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
				accept="image/png, image/jpeg, image/webp"
				bind:files={$generationInitImageFiles}
				{disabled}
				class="h-0 w-0 opacity-0"
			/>
			<div
				class="flex max-w-full items-center justify-start gap-2 py-3.25 pl-3.5 pr-4 transition not-touch:group-hover:text-c-primary
				md:py-3.5"
			>
				<IconDropzone class="h-5 w-5 shrink-0" />
				<p
					class="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-medium"
				>
					{$LL.Home.ImageInput.Title()}
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
	</div>
</TabBarWrapper>

{#if isImageModalOpen && $generationInitImageSrc && $generationInitImageWidth && $generationInitImageHeight}
	<div
		use:portal={'body'}
		class="fixed left-0 top-0 z-[10001] h-full w-full bg-c-barrier/80 px-3"
	/>
	<div
		use:portal={'body'}
		on:scroll={(e) => {
			scrollY = e.currentTarget.scrollTop;
		}}
		style="max-height: 100vh; max-height: {$windowHeight ? `${$windowHeight}px` : '100svh'};"
		class="fixed left-0 top-0 z-[10002] flex h-full w-full flex-col items-center overflow-auto pb-20 md:p-16"
	>
		<div class="flex w-full flex-1 flex-col items-center md:h-full md:min-h-[20rem]">
			<div class="flex w-full flex-1 flex-col items-center md:h-full md:max-w-full">
				<div
					class="sticky top-0 z-10 flex w-full items-center justify-start px-1 pb-2 pt-1 md:hidden"
				>
					<div
						class="flex items-center justify-center rounded-full transition duration-150 {scrollY &&
						scrollY > 5
							? 'bg-c-bg-secondary/75'
							: 'bg-c-bg-secondary/0'}"
					>
						<IconButton name="Close" onClick={closeImageModal}>
							<IconCancel
								class="h-9 w-9 transition not-touch:group-hover/iconbutton:text-c-primary"
							/>
						</IconButton>
					</div>
				</div>
				<div class="my-auto flex w-full max-w-5xl flex-1 justify-center px-2.5 md:h-full">
					<div
						use:clickoutside={{ callback: closeImageModal }}
						style="aspect-ratio: {$generationInitImageWidth / $generationInitImageHeight}"
						class="relative my-auto w-full max-w-lg md:max-h-full md:w-auto md:max-w-full"
					>
						<div class="absolute flex w-full flex-wrap items-center justify-end gap-3 p-3">
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
