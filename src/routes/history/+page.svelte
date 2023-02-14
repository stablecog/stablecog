<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/GenerationGridInfinite.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import {
		activeGeneration,
		activeGenerationOutputIndex,
		type TGeneration,
		type TGenerationOutputWithGeneration
	} from '$ts/stores/generation';
	import { onMount } from 'svelte';

	let generationOutputsWithGeneration: TGenerationOutputWithGeneration[];
	let lastOffset: string;
	const perPage = 50;
	let totalGenerations: number;

	let loading = true;
	onMount(async () => {
		loading = true;
		try {
			const { total_count, generations } = await getUserGenerations({
				perPage,
				offset: lastOffset
			});
			if (total_count !== undefined) {
				totalGenerations = total_count;
			}
			for (let i = 0; i < generations.length; i++) {
				const generation = generations[i];
				if (!generation.outputs || generation.outputs.length === 0) {
					continue;
				}
				const outputsWithGeneration: TGenerationOutputWithGeneration[] = generation.outputs.map(
					(output) => {
						return {
							...output,
							generation
						};
					}
				);
				if (!generationOutputsWithGeneration) {
					generationOutputsWithGeneration = [];
				}
				generationOutputsWithGeneration.push(...outputsWithGeneration);
			}
		} catch (error) {
			console.log('Generations error', error);
		}
		loading = false;
	});

	async function getUserGenerations({ perPage, offset }: { perPage: number; offset: string }) {
		const query = new URLSearchParams();
		query.append('per_page', perPage.toString());
		if (offset) {
			query.append('offset', offset);
		}
		const url = `${apiUrl.href}v1/user/generation?${query.toString()}`;
		const res = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + $page.data.session?.access_token
			}
		});
		const data: {
			generations: TGeneration[];
			total_count?: number;
		} = await res.json();
		console.log(data);
		return data;
	}
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:pt-6 pb-8 md:px-8">
	<div class="w-full max-w-7xl flex justify-center px-1.5">
		<div class="w-full flex flex-wrap gap-4 items-center px-2 py-2 md:px-4 md:py-3 rounded-xl">
			<div class="flex gap-2 items-center">
				<p class="font-bold text-xl md:text-2xl">
					{$LL.History.GenerationsTitle()}
				</p>
				<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
					({totalGenerations !== undefined ? totalGenerations : '...'})
				</p>
			</div>
		</div>
	</div>
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGridInfinite {generationOutputsWithGeneration} {loading} />
	</div>
</div>

{#if $activeGeneration && $activeGenerationOutputIndex !== undefined}
	<GenerationFullScreen
		generation={$activeGeneration}
		generationOutputIndex={$activeGenerationOutputIndex}
	/>
{/if}
