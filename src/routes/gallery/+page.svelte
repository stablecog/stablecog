<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGFullScreen from '$components/generationFullScreen/GenerationGFullScreen.svelte';
	import GenerationGImage from '$components/GenerationGImage.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { isValue } from '$ts/helpers/isValue';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import type { TGalleryResponse } from '$ts/types/main';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let generations = (data.generations || []).map((g) => ({ ...g, isLoadedBefore: false }));
	let currPage = data.page;
	let nextPage = data.next;
	let items = generations.map((_, i) => ({
		groupKey: currPage,
		key: i
	}));

	async function getNext(e: any) {
		if (!nextPage) {
			console.log('No more pages');
			return;
		}
		console.log('Getting the page:', nextPage);
		try {
			const res = await fetch(`/api/gallery?page=${nextPage}`);
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
				...resJson.generations.map((g) => ({ ...g, isLoadedBefore: false }))
			];
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
</script>

<MetaTag
	title="Gallery | Stablecog"
	description="A gallery full of images created with Stable Diffusion. Check out the images and their metadata which includes their prompt, negative prompt, inference steps, guidance scale and seed. You can generate similar images directly from the gallery or submit your own creations to it."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

{#if generations}
	<div class="w-full flex-1 flex flex-col items-center relative">
		<div class="w-full px-2 md:pt-4 pb-4 relative">
			<MasonryInfiniteGrid
				on:requestAppend={({ detail: e }) => {
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
									<GenerationGImage bind:generation={generations[item.key]} />
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</MasonryInfiniteGrid>
		</div>
		{#if isValue(nextPage)}
			<div class="w-full flex flex-1 flex-col items-center justify-center py-12">
				<IconLoading class="animate-spin-faster w-8 h-8 text-c-on-bg/50" />
			</div>
		{/if}
	</div>
{/if}
{#if $activeGenerationG}
	<GenerationGFullScreen generation={$activeGenerationG} />
{/if}
