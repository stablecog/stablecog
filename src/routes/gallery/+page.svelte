<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGFullScreen from '$components/generationFullScreen/GenerationGFullScreen.svelte';
	import GenerationGImage from '$components/generationImage/GenerationGImage.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { apiBase, canonicalUrl } from '$ts/constants/main';
	import { generationGPreviewUrlFromId } from '$ts/helpers/generationGPreviewUrlFromId';
	import { isValue } from '$ts/helpers/isValue';
	import { mLogGallerySearch } from '$ts/helpers/loggers';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import type { TGalleryResponse } from '$ts/types/main';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { onMount, tick } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const { galleryData, generationData } = data;
	activeGenerationG.set(undefined);
	let searchString: string;

	const initialGenerations = (galleryData.generations || []).map((g) => ({
		...g,
		didLoadBefore: true
	}));
	let generations = [...initialGenerations];
	const initialCurrPage = galleryData.page;
	let currPage = initialCurrPage;
	const initialNextPage = galleryData.next;
	let nextPage = initialNextPage;
	const initialItems = initialGenerations.map((_, i) => ({
		groupKey: currPage,
		key: i
	}));
	let items = [...initialItems];

	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 300;
	let searchStatus: 'idle' | 'searching' | 'searched' = 'idle';

	$: searchString, searchWithDebounce(searchString);

	let scrollDirection: 'up' | 'down' = 'up';
	let oldScrollY = 0;
	let atTheTop = true;

	async function searchWithDebounce(searchString: string) {
		searchStatus = 'idle';
		clearTimeout(searchTimeout);
		if (!searchString) {
			items = [...initialItems];
			generations = [...initialGenerations];
			currPage = initialCurrPage;
			nextPage = initialNextPage;
			searchStatus = 'idle';
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				try {
					searchStatus = 'searching';
					mLogGallerySearch({
						'SC - Search Query': searchString,
						'SC - Advanced Mode': $advancedModeApp,
						'SC - Locale': $locale,
						'SC - Plan': $page.data.tier
					});
					const res = await fetch(`${apiBase}/gallery?search=${searchString}`);
					if (res.status !== 200) {
						throw new Error('Error getting the page');
					}
					const resJson: TGalleryResponse = await res.json();
					console.log('resJson', resJson);
					nextPage = resJson.next;
					currPage = resJson.page;
					if (!currPage) {
						throw new Error('Page is null');
					}
					generations = [];
					items = [
						...resJson.generations.map((_, i) => ({
							groupKey: currPage,
							key: 0 + i
						}))
					];
					generations = [...resJson.generations.map((g) => ({ ...g, didLoadBefore: false }))];
					await tick();
					console.log('Searched - Generations length:', generations.length);
					console.log('Searched - Got the page:', currPage);
				} catch (error) {
					console.log(error);
				} finally {
					searchStatus = 'searched';
				}
			}
		}, searchDebounceMs);
	}

	async function getNext(e: any) {
		if (!nextPage) {
			console.log('No more pages');
			return;
		}
		console.log('Getting the page:', nextPage);
		try {
			const res = await fetch(
				`${apiBase}/gallery?page=${nextPage}${searchString ? `&search=${searchString}` : ''}`
			);
			if (res.status !== 200) {
				throw new Error('Error getting the page');
			}
			const resJson: TGalleryResponse = await res.json();
			nextPage = resJson.next;
			currPage = resJson.page;
			if (!currPage || !generations) {
				throw new Error('Page or generations is null');
			}
			items = [
				...items,
				...resJson.generations.map((_, i) => ({
					groupKey: currPage,
					key: generations.length + i
				}))
			];
			generations = [
				...generations,
				...resJson.generations.map((g) => ({ ...g, didLoadBefore: false }))
			];
			console.log('Generations length:', generations.length);
			console.log('Got the page:', currPage);
		} catch (error) {
			console.log(error);
		}
		e.ready();
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGenerationG !== undefined) {
			if (key === 'Escape') {
				activeGenerationG.set(undefined);
				window.history.replaceState({}, '', `/gallery`);
			} else if (key === 'ArrowLeft') {
				const index = generations.findIndex(({ id }) => id === $activeGenerationG?.id);
				if (index > 0) {
					activeGenerationG.set(generations[index - 1]);
				}
			} else if (key === 'ArrowRight') {
				const index = generations.findIndex(({ id }) => id === $activeGenerationG?.id);
				if (index < generations.length - 1) {
					activeGenerationG.set(generations[index + 1]);
				}
			}
		}
	}

	function capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	onMount(() => {
		if (generationData) {
			activeGenerationG.set({ ...generationData, didLoadBefore: false });
		}
	});
</script>

<MetaTag
	title="Gallery | Stablecog"
	description={generationData
		? `Check out this generation on the gallery: "${capitalize(
				generationData.prompt.text.slice(0, 200)
		  )}${generationData.prompt.text.length > 200 ? '...' : ''}".`
		: 'A gallery full of images created with Stable Diffusion. Check out the images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed. Generate similar images directly from the gallery or submit your own.'}
	imageUrl={generationData
		? generationGPreviewUrlFromId(generationData.id)
		: `${canonicalUrl}/previews${$page.url.pathname}.png`}
	canonical={generationData
		? `${canonicalUrl}${$page.url.pathname}?generation=${generationData.id}`
		: `${canonicalUrl}${$page.url.pathname}`}
/>

<svelte:window
	on:keydown={onKeyDown}
	on:scroll={(e) => {
		if (Math.abs(window.scrollY) < 50) {
			atTheTop = true;
			return;
		} else {
			atTheTop = false;
		}
		if (Math.abs(window.scrollY - oldScrollY) < 50) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = window.scrollY;
	}}
/>
{#if generations}
	<div class="w-full flex-1 flex flex-col items-center relative">
		<div
			class="w-full px-2 py-3 flex justify-center sticky top-18 md:top-20 z-10 transition {scrollDirection ===
			'up'
				? 'translate-y-0 opacity-100'
				: '-translate-y-22 pointer-events-none opacity-0'}"
		>
			<Input
				disabled={scrollDirection === 'down'}
				class="max-w-2xl"
				bind:value={searchString}
				title={$LL.Gallery.SearchInput.Title()}
				hasIcon
				hasClearButton
				bg="bg-secondary"
				shadow={!atTheTop ? 'strongest' : 'normal'}
			>
				<IconSearch slot="icon" class="w-full h-full" />
			</Input>
		</div>
		<div class="w-full px-2 py-3 relative flex flex-col flex-1">
			{#if searchStatus === 'searching' || (searchStatus === 'searched' && generations.length === 0)}
				<div
					class="w-full flex flex-col flex-1 text-c-on-bg/60 pt-6 pb-10 px-4 justify-center items-center text-center"
				>
					<div
						in:scale|local={{ duration: 200, easing: quadOut, opacity: 0, start: 0.5 }}
						class="w-16 h-16"
					>
						{#if searchStatus === 'searching'}
							<IconLoadingSlim class="animate-spin-faster w-full h-full" />
						{:else}
							<IconSearch class="w-full h-full" />
						{/if}
					</div>
					<p class="mt-2">
						{searchStatus === 'searching'
							? $LL.Gallery.SearchingTitle()
							: $LL.Gallery.NoMatchingGenerationTitle()}
					</p>
				</div>
			{:else}
				{#key searchStatus}
					<MasonryInfiniteGrid
						on:requestAppend={({ detail: e }) => {
							if (searchStatus === 'searching') return;
							e.wait();
							getNext(e);
						}}
						align="center"
						resizeDebounce={1}
						gap={0}
						column={0}
						threshold={1000}
						{items}
						let:visibleItems
					>
						{#each visibleItems as item (item.key)}
							<div
								class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 3xl:w-1/7 p-0.5 relative"
							>
								<div class="w-full relative">
									<ImagePlaceholder
										width={generations[item.key].width}
										height={generations[item.key].height}
									/>
									{#if $activeGenerationG === undefined || $activeGenerationG.id !== generations[item.key].id}
										<div
											in:elementreceive|local={{ key: generations[item.key].id }}
											out:elementsend|local={{ key: generations[item.key].id }}
											class="absolute left-0 top-0 w-full h-full group rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
										>
											<GenerationGImage generation={generations[item.key]} />
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</MasonryInfiniteGrid>
				{/key}
				{#if isValue(nextPage)}
					<div class="w-full flex flex-col flex-1 items-center justify-center py-12">
						<IconLoadingSlim class="animate-spin-faster w-12 h-12 text-c-on-bg/50" />
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
{#if $activeGenerationG}
	<GenerationGFullScreen generation={$activeGenerationG} />
{/if}
