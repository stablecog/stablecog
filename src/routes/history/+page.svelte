<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { maxLocallyStoredImage } from '$ts/constants/indexedDb';
	import { apiBase, canonicalUrl } from '$ts/constants/main';
	import { getGenerationsFromDb, updateGenerationInDb } from '$ts/queries/indexedDb';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import type { TDBGeneration, TIndexedDBGeneration } from '$ts/types/db';
	import type { TGenerationUI, TUpscaleStatus } from '$ts/types/main';
	import { onMount } from 'svelte';

	let generations: TIndexedDBGeneration[];
	let upscaleStatus: TUpscaleStatus;
	let historyType: 'local' | 'cloud' = 'local';
	let currentPage = 1;
	let nextPage: number | null = null;

	interface IGenerationResponse {
		data: { generations: TDBGeneration[]; page: number; next: number | undefined | null } | null;
		error: string | null;
	}

	async function getGenerations() {
		const res = await fetch(`${apiBase}/user/generations?page=${currentPage}`, {
			headers: {
				Authorization: $page.data.session?.access_token || ''
			}
		});
		const resJson: IGenerationResponse = await res.json();
		console.log(resJson.data, resJson.error);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined && upscaleStatus !== 'loading') {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			} else if (key === 'ArrowLeft') {
				const index = generations.findIndex(({ id }) => id === $activeGeneration?.id);
				if (index > 0) {
					activeGeneration.set(generations[index - 1]);
				}
			} else if (key === 'ArrowRight') {
				const index = generations.findIndex(({ id }) => id === $activeGeneration?.id);
				if (index < generations.length - 1) {
					activeGeneration.set(generations[index + 1]);
				}
			}
		}
	}

	async function onUpscale(event: CustomEvent<{ generation: TGenerationUI }>) {
		const { generation } = event.detail;
		const { imageUrl, upscaledImageUrl, computeRatePerSec, ...rest } = generation;
		try {
			await updateGenerationInDb(rest);
		} catch (error) {
			console.log('IndexDB error', error);
		}
		const index = generations.findIndex(({ id }) => id === generation.id);
		generations[index].upscaledImageDataB64 = rest.upscaledImageDataB64;
		activeGeneration.set(generation);
	}

	async function onDelete(event: CustomEvent<{ generation: TGenerationUI }>) {
		const { generation } = event.detail;
		const index = generations.findIndex(({ id }) => id === generation.id);
		generations.splice(index, 1);
		generations = [...generations];
		activeGeneration.set(undefined);
	}

	let loading = true;
	onMount(async () => {
		loading = true;
		try {
			generations = await getGenerationsFromDb();
		} catch (error) {
			console.log('IndexDB error', error);
		}
		loading = false;
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:pt-6 pb-8 md:px-8">
	{#if generations === undefined || generations.length !== 0}
		<div class="w-full max-w-7xl flex justify-center px-1.5">
			<div class="w-full flex flex-wrap gap-3 items-center px-2 py-2 md:px-4 md:py-3 rounded-xl">
				<div class="flex gap-2 items-center">
					<p class="font-bold text-xl md:text-2xl">
						{$LL.History.GenerationsTitle()}
					</p>
					<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
						({generations?.length.toLocaleString($locale) ?? '...'})
					</p>
				</div>
				<p
					class="text-xs md:text-sm text-c-primary/75 font-semibold bg-c-primary/15 px-2 py-1 md:px-3 md:py-1.5
						rounded-md md:rounded-lg"
				>
					{$LL.History.GenerationsMaxSavedCountWarning({ count: maxLocallyStoredImage })}
				</p>
			</div>
		</div>
	{/if}
	<div class="w-full flex-1 max-w-7xl flex flex-col px-1">
		<GenerationGrid {generations} {loading} />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen
		bind:upscaleStatus
		on:delete={onDelete}
		on:upscale={onUpscale}
		generation={$activeGeneration}
	/>
{/if}
