<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import { getSystemStatus, systemStatusQueryKey } from '$routes/(app)/admin/system/helpers.js';
	import { getApiUrl, staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';
	import { createMutation, createQuery } from '@tanstack/svelte-query';

	$: systemStatusQuery = $sessionStore?.access_token
		? createQuery({
				queryKey: systemStatusQueryKey,
				queryFn: () => getSystemStatus($sessionStore.access_token)
			})
		: undefined;

	let pendingSystemBackend: string | null = null;
	$: systemBackendMutation = createMutation({
		mutationKey: ['change-system-backend'],
		mutationFn: async ({ backend }: { backend: string }) => {
			if (!$systemStatusQuery?.data?.backend) return;
			pendingSystemBackend = backend;
			const res = await fetch(`${getApiUrl().origin}/v1/admin/system/change-backend`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${$sessionStore?.access_token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ backend })
			});
			if (!res.ok) {
				throw new Error('Failed to set system backend');
			}
			await $systemStatusQuery?.refetch();
		},
		onSuccess: () => {
			pendingSystemBackend = null;
		},
		onError: () => {
			pendingSystemBackend = null;
		}
	});
</script>

<MetaTag
	title="Users | System"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<PageWrapper noPadding class="z-10 py-3">
	{#if systemStatusQuery === undefined || $systemStatusQuery === undefined || $systemStatusQuery.isPending}
		<div class="flex w-full flex-1 flex-col items-center justify-center pb-12 pt-8">
			<IconAnimatedSpinner class="size-10 text-c-on-bg/50" />
		</div>
	{:else if $systemStatusQuery.isError}
		<div class="flex w-full flex-1 flex-col items-center justify-center pb-12 pt-8">
			<IconSadFaceOutline class="size-10 text-c-on-bg/50" />
		</div>
	{:else if $systemStatusQuery.data.backends.length < 1}
		<div class="flex w-full flex-1 flex-col items-center justify-center pb-12 pt-8">
			<p class="text-c-on-bg/50">No backends found</p>
		</div>
	{:else}
		<div class="flex w-full flex-1 flex-col items-center justify-center pb-12 pt-8">
			<div class="flex max-w-full flex-col">
				<h1 class="px-2 text-center text-2xl font-bold">Backends</h1>
				<div
					class="mt-4 flex max-w-full flex-col rounded-xl bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary md:max-w-xs"
				>
					{#each $systemStatusQuery.data.backends as backend}
						<button
							on:click={$systemStatusQuery.data.backend !== backend
								? () => $systemBackendMutation?.mutate({ backend })
								: () => null}
							disabled={$systemBackendMutation?.isPending}
							class="group relative -mt-1 flex max-w-full flex-row items-center rounded-lg p-1 text-left text-lg font-medium first:mt-0"
						>
							<div
								class="relative flex w-full flex-row items-center gap-2 rounded-lg px-5 py-3 {$systemStatusQuery
									.data.backend === backend
									? 'bg-c-bg-secondary text-c-on-bg shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)]'
									: 'text-c-on-bg/60'}"
							>
								<ButtonHoverEffect
									noPadding
									size="md"
									color="bg-secondary"
									hovered={$systemBackendMutation?.isPending && pendingSystemBackend === backend}
								/>
								<div class="size-5 shrink-0">
									<IconAnimatedSpinner
										loading={$systemBackendMutation?.isPending && pendingSystemBackend === backend}
										class="size-5 transition duration-150 {$systemBackendMutation?.isPending &&
										pendingSystemBackend === backend
											? 'scale-100 opacity-100'
											: 'scale-0 opacity-0'}"
									/>
								</div>
								<p
									class="relative min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap transition duration-150 {$systemBackendMutation?.isPending &&
									pendingSystemBackend === backend
										? 'translate-x-0'
										: '-translate-x-7'}"
								>
									{backend}
								</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</PageWrapper>
