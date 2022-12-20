<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGFullScreen from '$components/generationFullScreen/GenerationGFullScreen.svelte';
	import GenerationGImageAdmin from '$components/generationImage/GenerationGImageAdmin.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
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
			items = [
				...items,
				...resJson.generations.map((_, i) => ({
					groupKey: currPage,
					key: generations.length + i
				}))
			];
			generations = [
				...generations,
				...resJson.generations.map((g) => {
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

	let scrollTop = 0;
	function onScroll() {
		scrollTop = window.scrollY;
	}
</script>

<MetaTag
	title="Gallery | Stablecog"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} on:scroll={onScroll} />

<div class="w-full px-5 pt-3 pb-1.5 sticky z-50 top-20 flex items-center justify-center">
	<div
		class="px-6 py-3 rounded-xl shadow-navbar transition ring-2 {scrollTop > 0
			? 'bg-c-bg shadow-c-shadow/[var(--o-shadow-strongest)] ring-c-bg-secondary'
			: 'bg-c-bg/0 shadow-c-shadow/0 ring-transparent'}"
	>
		{#if totalCount !== undefined && totalCount !== null}
			<p class="font-bold">
				<span class="text-c-on-bg/60 font-normal">Total:</span>
				{totalCount - (approved + deleted)}
			</p>
		{/if}
	</div>
</div>
{#if generations && generations.length > 0}
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
									<GenerationGImageAdmin bind:generation={generations[item.key]} />
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
