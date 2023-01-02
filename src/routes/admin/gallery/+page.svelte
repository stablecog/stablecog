<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGFullScreen from '$components/generationFullScreen/GenerationGFullScreen.svelte';
	import GenerationGImageAdmin from '$components/generationImage/GenerationGImageAdmin.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { isValue } from '$ts/helpers/isValue';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import type { TGalleryResponse, TGenerationGAdmin } from '$ts/types/main';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let generations: TGenerationGAdmin[] = (data.generations || []).map((g) => ({
		...g,
		didLoadBefore: false,
		status: 'idle'
	}));

	let currPage = data.page;
	let nextPage = data.next;
	let items = generations.map((_, i) => ({
		groupKey: currPage,
		key: i
	}));

	let totalCount = data.totalCount;
	$: approved = generations.filter((g) => g.status === 'approved').length;
	$: deleted = generations.filter((g) => g.status === 'deleted').length;

	async function getNext(e: any) {
		if (!nextPage) {
			console.log('No more pages');
			return;
		}
		console.log('Getting the page:', nextPage);
		try {
			const res = await fetch(`/admin/api/gallery?page=${nextPage}`);
			if (res.status !== 200) {
				throw new Error('Error getting the page');
			}
			const resJson: TGalleryResponse = await res.json();
			nextPage = resJson.next;
			currPage = resJson.page;
			if (!currPage || !generations) {
				throw new Error('Page or generations is null');
			}
			const generationIds = generations.map((g) => g.id);
			const filteredGenerations = resJson.generations.filter((g) => !generationIds.includes(g.id));
			items = [
				...items,
				...filteredGenerations.map((_, i) => ({
					groupKey: currPage,
					key: generations.length + i
				}))
			];
			generations = [
				...generations,
				...filteredGenerations.map((g) => {
					const gen: TGenerationGAdmin = {
						...g,
						didLoadBefore: false,
						status: 'idle'
					};
					return gen;
				})
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
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full px-5 pt-3 pb-1.5 sticky z-50 top-20 flex items-center justify-center">
	<div
		class="px-1 py-3 transition flex items-center justify-center flex-wrap 
		gap-4 md:gap-12 bg-c-bg ring-2 ring-c-bg-secondary rounded-2xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
	>
		{#if totalCount !== undefined && totalCount !== null}
			<div class="flex flex-col px-4">
				<p class="text-xs font-medium text-c-on-bg/50">
					{$LL.Admin.Gallery.TotalTitle()}
				</p>
				<p class="font-bold text-xl text-c-on-bg mt-0.5">{totalCount - (approved + deleted)}</p>
			</div>
			<div class="flex flex-col px-4">
				<p class="text-xs font-medium text-c-on-bg/50">
					{$LL.Admin.Gallery.ApprovedTitle()}
				</p>
				<p class="font-bold text-xl text-c-success mt-0.5">{approved}</p>
			</div>
			<div class="flex flex-col px-4">
				<p class="text-xs font-medium text-c-on-bg/50">
					{$LL.Admin.Gallery.DeletedTitle()}
				</p>
				<p class="font-bold text-xl text-c-danger mt-0.5">{deleted}</p>
			</div>
		{/if}
	</div>
</div>
{#if generations && generations.length > 0}
	<div class="w-full flex-1 flex flex-col items-center relative">
		<div class="w-full px-2 pt-4 pb-4 relative">
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
									<GenerationGImageAdmin bind:generation={generations[item.key]} />
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</MasonryInfiniteGrid>
		</div>
		{#if isValue(nextPage)}
			<div class="w-full flex flex-col flex-1 items-center justify-center py-12">
				<IconLoadingSlim class="animate-spin-faster w-12 h-12 text-c-on-bg/50" />
			</div>
		{/if}
	</div>
{:else}
	<div class="w-full flex flex-1 px-5 justify-center py-8">
		<div class="w-full flex justify-center items-center max-w-sm my-auto">
			<p class="text-c-on-bg/50">{$LL.Admin.NoGenerationsToReview()}</p>
		</div>
	</div>
{/if}
{#if $activeGenerationG}
	<GenerationGFullScreen generation={$activeGenerationG} />
{/if}
