<script lang="ts">
	import GenerationGImage from '$components/GenerationGImage.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import Masonry from '$components/Masonry.svelte';
	import type { PageServerData } from '../../../.svelte-kit/types/src/routes/gallery/$types';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let data: PageServerData;

	let generations = data.generations || [];
	const placeholders = Array.from({ length: 50 }, () => ({
		width: 512,
		height: Math.random() < 0.5 ? 512 : 768
	}));
	let page = data.page;
	let next = data.next;
	let bottomDiv: HTMLDivElement;
	let observer: globalThis.IntersectionObserver | null | undefined;

	let fetching = false;

	async function getNext() {
		if (fetching) return;
		if (!next) return;
		fetching = true;
		try {
			console.log('Getting next page:', next);
			const res = await fetch(`/api/gallery?page=${next}`);
			const resJson = await res.json();
			generations = [...generations, ...resJson.generations];
			next = resJson.next;
			page = resJson.page;
			console.log('Got the page:', page);
			if (next === null) {
				console.log('No more pages');
				observer?.disconnect();
				console.log('Disconnected observer');
				return;
			} else {
				next = resJson.next;
			}
		} catch (error) {
			console.log(error);
		}
		fetching = false;
	}
</script>

{#if generations}
	<div class="w-full flex-1 flex flex-col items-center relative">
		<div
			class="flex justify-center py-4 px-8 mb-4 sticky top-24 bg-c-bg rounded-xl 
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] z-50"
		>
			{generations.length}
		</div>
		<div class="w-full px-0.5 py-4 relative">
			<Masonry items={generations} colWidth="minmax(Min(20rem, 100%), 1fr)">
				{#each generations as generation}
					<div
						class="group relative rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
          	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
					>
						<ImagePlaceholder width={generation.width} height={generation.height} />
						<GenerationGImage {generation} />
					</div>
				{/each}
				<IntersectionObserver
					rootMargin="100%"
					element={bottomDiv}
					on:intersect={getNext}
					bind:observer
				>
					<div class="w-full" bind:this={bottomDiv} />
				</IntersectionObserver>
				{#if next}
					{#each placeholders as placeholder}
						<div
							class="group relative rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
							shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
						>
							<ImagePlaceholder width={placeholder.width} height={placeholder.height} />
						</div>
					{/each}
				{/if}
			</Masonry>
		</div>
	</div>
{/if}
