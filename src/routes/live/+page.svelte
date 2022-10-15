<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import type { TDBGenerationProcessStatus } from 'src/routes/api/generate-image/+server';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';

	let generations: TGeneration[] = [];
	let getAndSetDataInterval: NodeJS.Timeout;
	let startTimestamp: number;
	const getAndSetDataIntervalDuration = 2000;
	let generationTotalCount = tweened(0, {
		duration: 500,
		easing: quadOut
	});
	let generationTotalDurationMs = tweened(0, {
		duration: 500,
		easing: quadOut
	});

	interface TGeneration {
		id: string;
		status: TDBGenerationProcessStatus;
		country_code: string | null;
		duration_ms: number | null;
		created_at: string;
	}

	onMount(async () => {
		startTimestamp = Date.now();
		if (supabase) {
			getAndSetData();
		} else {
			console.log('Supabase is not detected.');
		}
	});

	onDestroy(() => {
		if (supabase) {
			clearInterval(getAndSetDataInterval);
		}
	});

	async function getAndSetData() {
		if (supabase) {
			clearInterval(getAndSetDataInterval);
			try {
				const [generationsRes] = await Promise.all([
					supabase
						.from('generation_public')
						.select('*')
						.order('created_at', { ascending: false })
						.filter('updated_at', 'gte', new Date(startTimestamp).toISOString())
						.limit(100)
				]);
				if (generationsRes.data) {
					generations = [...generationsRes.data];
				}
				const [durationRes, countRes] = await Promise.all([
					supabase.rpc('generation_duration_ms_total_estimate_with_constant'),
					supabase.rpc('generation_count')
				]);
				if (durationRes.data && countRes.data) {
					const count = Number(countRes.data);
					const duration = Number(durationRes.data);
					if (count > $generationTotalCount) {
						generationTotalCount.set(count);
						console.log('generationTotalCount:', count);
					}
					if (duration > $generationTotalDurationMs) {
						generationTotalDurationMs.set(duration);
						console.log('generationTotalDurationMs:', duration);
					}
				} else {
					console.log(durationRes.error, countRes.error);
				}
			} catch (error) {
				console.log(error);
			} finally {
				getAndSetDataInterval = setInterval(getAndSetData, getAndSetDataIntervalDuration);
			}
		}
	}
</script>

<MetaTag
	title="Live | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-5xl">
		<div class="w-full flex flex-wrap items-center justify-center py-6 gap-10 md:gap-14">
			<div class="w-full md:w-64 max-w-full flex flex-col gap-1.5 text-center md:text-right">
				<h1 class="text-c-on-bg/50 text-sm">Generations</h1>
				<p class="font-bold text-4xl">
					{Math.floor($generationTotalCount).toLocaleString('en-US')}
				</p>
			</div>
			<div class="w-full md:w-64 max-w-full flex flex-col gap-1.5 text-center md:text-left">
				<h1 class="text-c-on-bg/50 text-sm">Total GPU Time</h1>
				<p class="font-bold text-4xl">
					{Math.round($generationTotalDurationMs / 1000).toLocaleString('en-US')}s
				</p>
			</div>
		</div>
		{#if generations && generations.length > 0}
			<div transition:expandCollapse|local={{ duration: 300 }} class="w-full">
				<div class="w-full flex flex-wrap items-center justify-center py-6">
					{#each generations as generation (generation.id)}
						<div
							in:elementreceive|local={{ key: generation.id }}
							out:elementsend|local={{ key: generation.id }}
							animate:flip={{ duration: 300, easing: quadOut }}
							class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-1.5"
						>
							<div class="p-7 relative overflow-hidden z-0 rounded-full">
								{#if generation.status === 'started'}
									<div
										transition:scale|local={{ duration: 300, easing: quadOut }}
										class="absolute w-full h-full left-0 top-0 origin-center"
									>
										<div class="w-full h-full">
											<div
												class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
											/>
										</div>
									</div>
								{/if}
								<div class="w-10 h-10 relative">
									{#if generation.status === 'started'}
										<div
											transition:scale|local={{ duration: 300, easing: quadOut }}
											class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
										/>
									{/if}
									<div
										class="w-full h-full rounded-full transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 {generation.status ===
										'succeeded'
											? 'bg-c-success'
											: generation.status === 'failed'
											? 'bg-c-danger'
											: 'bg-c-primary'}"
									>
										{#if generation.country_code}
											<p class="text-center text-xs font-bold text-c-on-primary/50">
												{generation.country_code}
											</p>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if supabase}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full overflow-hidden z-0 relative max-w-lg"
			>
				<div class="w-full flex flex-col items-center justify-start py-4">
					<div
						class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-1.5"
					>
						<div class="p-7 relative overflow-hidden z-0 rounded-full">
							<div
								transition:scale|local={{ duration: 300, easing: quadOut }}
								class="absolute w-full h-full left-0 top-0 origin-center"
							>
								<div class="w-full h-full">
									<div
										class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
									/>
								</div>
							</div>
							<div class="w-10 h-10 relative">
								<div
									transition:scale|local={{ duration: 300, easing: quadOut }}
									class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
								/>
								<div
									class="w-full h-full rounded-full transition-all duration-300 flex 
									items-center justify-center relative overflow-hidden z-0 bg-c-primary"
								/>
							</div>
						</div>
					</div>
					<p class="w-full text-c-on-bg/40 text-center mt-1.5">Waiting for generations</p>
				</div>
			</div>
		{:else}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-full overflow-hidden z-0 relative max-w-lg"
			>
				<div class="w-full flex flex-col items-center justify-start gap-5 py-4">
					<p class="w-full leading-relaxed text-c-on-bg/40 text-center">
						Supabase instance not found. Can't listen for generations.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
