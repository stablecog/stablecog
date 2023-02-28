<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconFunnel from '$components/icons/IconFunnel.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import Morpher from '$components/Morpher.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import LL from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import {
		getAllUserGenerationFullOutputs,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import {
		adminGalleryActionableItems,
		adminGalleryFilter,
		isAdminGalleryEditActive,
		adminGalleryScheduledIds,
		type TAdminGalleryAction
	} from '$ts/stores/admin/gallery';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { activeGeneration } from '$userStores/generation';
	import {
		createInfiniteQuery,
		useQueryClient,
		type CreateInfiniteQueryResult
	} from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';

	let totalOutputs: number;

	const queryClient = useQueryClient();

	let allUserGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	$: allUserGenerationFullOutputsQuery = $page.data.session?.user.id
		? createInfiniteQuery({
				queryKey: ['user_generation_full_outputs'],
				queryFn: (lastPage) => {
					return getAllUserGenerationFullOutputs({
						access_token: $page.data.session?.access_token || '',
						cursor: lastPage?.pageParam,
						gallery_status: $adminGalleryFilter
					});
				},
				getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	$: $allUserGenerationFullOutputsQuery?.data?.pages, onPagesChanged();

	let approveOrRejectStatus: 'idle' | 'approving' | 'rejecting' = 'idle';

	async function doActionOnItems(action: TAdminGalleryAction) {
		if (action === 'approve') {
			approveOrRejectStatus = 'approving';
		} else if (action === 'reject') {
			approveOrRejectStatus = 'rejecting';
		}
		try {
			const ids = $adminGalleryScheduledIds;
			const res = await fetch(`${apiUrl.origin}/v1/admin/gallery`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({
					action,
					generation_output_ids: ids
				})
			});
			if (!res.ok) throw new Error('Error approving/rejecting generation outputs');
			const resJson = await res.json();
			adminGalleryActionableItems.set(
				$adminGalleryActionableItems.filter((i) => !ids.includes(i.id))
			);
			queryClient.setQueryData(['user_generation_full_outputs'], (data: any) => ({
				...data,
				pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
					return {
						...page,
						outputs: page.outputs.map((output) =>
							ids.includes(output.id)
								? {
										...output,
										gallery_status:
											action === 'approve'
												? 'approved'
												: action === 'reject'
												? 'rejected'
												: undefined
								  }
								: output
						)
					};
				})
			}));
		} catch (error) {
			console.log(error);
		} finally {
			approveOrRejectStatus = 'idle';
		}
	}

	const onPagesChanged = () => {
		if (!$page.data.session?.user.id || !$allUserGenerationFullOutputsQuery) return;
		if (!$allUserGenerationFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $allUserGenerationFullOutputsQuery.data.pages.length; i++) {
			let page = $allUserGenerationFullOutputsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalOutputs = page.total_count;
			}
		}
	};
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 md:py-6 md:px-8 relative">
	{#if !$page.data.session?.user.id}
		<div class="w-full flex-1 max-w-7xl flex justify-center px-2 py-4 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo="/history" />
				<div class="w-full h-[1vh]" />
			</div>
		</div>
	{:else}
		<div class="w-full max-w-7xl flex flex-col justify-center px-1.5">
			<div class="w-full flex flex-wrap gap-4 items-center px-2 py-2 md:px-4 md:py-3 rounded-xl">
				<div class="flex gap-2 items-center">
					<p class="font-bold text-xl md:text-2xl">
						{$LL.History.GenerationsTitle()}
					</p>
					<p class="text-sm md:text-base text-c-on-bg/50 font-semibold mt-0.5 md:mt-1">
						({totalOutputs !== undefined ? totalOutputs : '...'})
					</p>
				</div>
			</div>
		</div>
		<div
			style="top: {$navbarHeight + 4}px"
			class="w-full max-w-7xl flex flex-wrap gap-3 md:gap-4 p-2 md:p-3 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] 
			rounded-2xl bg-c-bg sticky z-10 -mt-2 border-2 border-c-bg-secondary"
		>
			<SubtleButton
				class="z-10"
				onClick={() => isAdminGalleryEditActive.set(!$isAdminGalleryEditActive)}
			>
				<div class="flex items-center justify-center gap-4 px-1 md:px-2">
					<p class="text-sm md:text-base">
						{$LL.Admin.EditViewButton()}
					</p>
					<div class="-mr-1">
						<ToggleIndicator isToggled={$isAdminGalleryEditActive} />
					</div>
				</div>
			</SubtleButton>
			{#if $isAdminGalleryEditActive}
				<div
					transition:fly|local={{ opacity: 0, x: -100, easing: quadOut, duration: 150 }}
					class="flex flex-wrap gap-3 md:gap-4"
				>
					{#if $adminGalleryFilter !== 'approved'}
						<SubtleButton
							disabled={approveOrRejectStatus === 'rejecting'}
							loading={approveOrRejectStatus === 'approving'}
							onClick={() => doActionOnItems('approve')}
						>
							<Morpher morphed={approveOrRejectStatus === 'approving'}>
								<p
									slot="item-0"
									class="text-sm md:text-base text-c-success px-1 md:px-3 {approveOrRejectStatus !==
									'approving'
										? 'opacity-100 scale-100'
										: 'opacity-0 scale-50'}"
								>
									{$LL.Admin.ApproveButton()}<span
										class="text-sm ml-1 font-normal text-c-success/75"
										>({$adminGalleryScheduledIds.length})</span
									>
								</p>
								<div slot="item-1">
									<IconLoadingSlim class="w-8 h-8 text-c-success animate-spin-faster" />
								</div>
							</Morpher>
						</SubtleButton>
					{/if}
					{#if $adminGalleryFilter !== 'rejected'}
						<SubtleButton
							disabled={approveOrRejectStatus === 'approving'}
							loading={approveOrRejectStatus === 'rejecting'}
							onClick={() => doActionOnItems('reject')}
						>
							<Morpher morphed={approveOrRejectStatus === 'rejecting'}>
								<p
									slot="item-0"
									class="text-sm md:text-base text-c-danger px-1 md:px-3 {approveOrRejectStatus !==
									'rejecting'
										? 'opacity-100 scale-100'
										: 'opacity-0 scale-50'}"
								>
									{$LL.Admin.RejectButton()}<span class="text-sm ml-1 font-normal text-c-danger/75"
										>({$adminGalleryScheduledIds.length})</span
									>
								</p>
								<div slot="item-1">
									<IconLoadingSlim class="w-8 h-8 text-c-danger animate-spin-faster" />
								</div>
							</Morpher>
						</SubtleButton>
					{/if}
				</div>
			{/if}
			<div class="w-full md:w-64 max-w-full flex ml-auto">
				<TabLikeDropdown
					class="w-full"
					name="Filter"
					items={[
						{ label: $LL.Admin.Gallery.StatusDropdown.Submitted(), value: 'submitted' },
						{ label: $LL.Admin.Gallery.StatusDropdown.Approved(), value: 'approved' },
						{ label: $LL.Admin.Gallery.StatusDropdown.Rejected(), value: 'rejected' },
						{ label: $LL.Admin.Gallery.StatusDropdown.Private(), value: 'not_submitted' }
					]}
					bind:value={$adminGalleryFilter}
				>
					<div slot="title">
						<Morpher
							morphed={allUserGenerationFullOutputsQuery === undefined ||
								$allUserGenerationFullOutputsQuery === undefined ||
								$allUserGenerationFullOutputsQuery.isFetching}
						>
							<div slot="item-0" class="p-3.5 flex items-center justify-center">
								<IconFunnel class="w-6 h-6 text-c-on-bg/35" />
							</div>
							<div slot="item-1" class="transform transition">
								<IconLoadingSlim class="w-8 h-8 animate-spin-faster text-c-on-bg/35" />
							</div>
						</Morpher>
					</div>
				</TabLikeDropdown>
			</div>
		</div>
		<div class="w-full flex-1 max-w-7xl flex flex-col">
			{#if allUserGenerationFullOutputsQuery === undefined || $allUserGenerationFullOutputsQuery === undefined || $allUserGenerationFullOutputsQuery.isLoading}
				<div
					class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
				>
					<div class="w-16 h-16">
						<IconLoadingSlim class="animate-spin-faster w-full h-full" />
					</div>
					<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
					<div class="h-[2vh]" />
				</div>
			{:else if $allUserGenerationFullOutputsQuery?.data?.pages?.length === 1 && $allUserGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
				<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
					<div class="flex flex-col my-auto items-center gap-6">
						<p class="text-c-on-bg/50">{$LL.History.NoGenerationsYet()}</p>
						<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
						<div class="h-[1vh]" />
					</div>
				</div>
			{:else if $allUserGenerationFullOutputsQuery.isError}
				<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
					<div class="flex flex-col my-auto items-center gap-2">
						<IconSadFace class="w-16 h-16 text-c-on-bg/50" />
						<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
					</div>
				</div>
			{:else}
				<GenerationGridInfinite
					generationsQuery={allUserGenerationFullOutputsQuery}
					cardType="admin-gallery"
				/>
			{/if}
		</div>
	{/if}
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="admin-gallery" />
{/if}
