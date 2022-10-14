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

	let channel: RealtimeChannel;
	let generations: TPayload[] = [];
	let clearMessageInterval: NodeJS.Timeout;
	const clearMessageIntervalDuration = 1000 * 10;
	const maxDurationSec = 60 * 15;
	const timestampDescSort = (a: TPayload, b: TPayload) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	};
	let generationTotalCount = tweened(0, {
		duration: 500,
		easing: quadOut
	});
	let generationTotalDurationMs = tweened(0, {
		duration: 500,
		easing: quadOut
	});

	interface TPayload {
		id: string;
		status: TDBGenerationProcessStatus;
		generation_id: string | null;
		country_code: string | null;
		created_at: string;
		updated_at: string;
	}

	onMount(async () => {
		if (supabase) {
			await getAndSetTotals();
			channel = supabase.channel('db-generation-process');
			channel.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'generation_process'
				},
				(payload) => {
					console.log('payload', payload);
					getAndSetTotals();
					const entry = payload.new as TPayload;
					if (!generations.map((i) => i.id).includes(entry.id)) {
						generations = [entry, ...generations].sort(timestampDescSort);
					} else {
						const index = generations.findIndex((i) => i.id === entry.id);
						if (index !== -1) {
							generations[index] = entry;
							generations = [...generations].sort(timestampDescSort);
						}
					}
					console.log('generations', generations);
				}
			);
			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					console.log('subscribed to db-generation-process');
				}
			});
			clearMessageInterval = setInterval(() => {
				if (generations && generations.length > 0) {
					generations = generations.filter((i) => {
						const createdAt = new Date(i.created_at);
						const now = new Date();
						const diff = now.getTime() - createdAt.getTime();
						const diffInSec = diff / 1000;
						return diffInSec <= maxDurationSec;
					});
				}
			}, clearMessageIntervalDuration);
		} else {
			console.log('Supabase is not detected.');
		}
	});

	onDestroy(() => {
		if (supabase) {
			supabase.removeAllChannels();
			if (channel) {
				channel.unsubscribe();
			}
		}
		clearInterval(clearMessageInterval);
	});

	async function getAndSetTotals() {
		if (supabase) {
			try {
				const [duration, count, d] = await Promise.all([
					supabase.rpc('generation_duration_ms_total_estimate'),
					supabase.rpc('generation_count'),
					supabase.rpc('non_null_generation_duration_ms_total')
				]);
				console.log(Math.round(Number(d.data) / 1000), Math.round(Number(duration.data) / 1000));
				if (duration.data && count.data) {
					const _count = Number(count.data);
					const _duration = Number(d.data);
					if (_count > $generationTotalCount) {
						generationTotalCount.set(_count);
						console.log('generationTotalCount:', $generationTotalCount);
					} else {
						console.log('no change in generationTotalCount, new result is equal or smaller');
					}
					if (_duration > $generationTotalDurationMs) {
						generationTotalDurationMs.set(_duration);
						console.log('generationTotalDurationMs:', $generationTotalDurationMs);
					} else {
						console.log('no change in generationTotalDurationMs, new result is equal or smaller');
					}
				} else {
					console.log(duration.error, count.error);
				}
			} catch (error) {
				console.log(error);
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
		<div class="w-full flex flex-wrap items-center justify-center py-6 text-center gap-8">
			<div class="w-full md:w-52 max-w-full flex flex-col gap-2">
				<h1 class="text-c-on-bg/50 text-sm">Generations</h1>
				<p class="font-bold text-4xl">
					{Math.floor($generationTotalCount).toLocaleString('en-US')}
				</p>
			</div>
			<div class="w-full md:w-52 max-w-full flex flex-col gap-2">
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
							class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-1"
						>
							<div class="p-6 relative overflow-hidden z-0 rounded-full">
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
					<div class="flex items-center justify-center relative overflow-hidden z-0 rounded-full">
						<div class="p-6 relative overflow-hidden z-0 rounded-full">
							<div class="absolute w-full h-full left-0 top-0 origin-center">
								<div class="w-full h-full">
									<div
										class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
									/>
								</div>
							</div>
							<div class="w-10 h-10 relative">
								<div
									class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
								/>
								<div
									class="w-full h-full rounded-full transition-all duration-300 flex items-center justify-center relative overflow-hidden z-0 bg-c-primary"
								/>
							</div>
						</div>
					</div>
					<p class="w-full text-c-on-bg/40 text-center py-1">Waiting for generations</p>
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
