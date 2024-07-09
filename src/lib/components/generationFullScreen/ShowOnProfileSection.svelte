<script lang="ts">
	import { page } from '$app/stores';
	import ToggleIndicator from '$components/primitives/ToggleIndicator.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconEyeOutline from '$components/icons/IconEyeOutline.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { getUserProfileInfiniteQueryKey } from '$routes/(app)/[username]/constants';
	import { apiUrl } from '$ts/constants/main';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import {
		logGenerationOutputMadePrivate,
		logGenerationOutputMadePublic
	} from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import {
		setGenerationOutputVisibility,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		generatePageHistoryFullOutputsQueryKey,
		historyFullOutputsQueryKey
	} from '$ts/stores/user/queryKeys';
	import { userSummary } from '$ts/stores/user/summary';
	import { createCheckbox } from '@melt-ui/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';
	import { sessionStore } from '$ts/constants/supabase';
	import type { TGalleryFullOutputsPage } from '$ts/queries/galleryLike/types';

	export let modalType: TGenerationFullScreenModalType;
	export let generation: TGenerationWithSelectedOutput;

	$: was_initially_public =
		generation.selected_output.is_public ||
		generation.selected_output.gallery_status === 'submitted'
			? true
			: false;
	$: canToggleVisibility =
		generation.selected_output.was_auto_submitted === false ||
		$userSummary?.has_nonfree_credits ||
		$userSummary?.product_id !== undefined ||
		isSuperAdmin($userSummary?.roles) ||
		isGalleryAdmin($userSummary?.roles);
	$: checkbox = createCheckbox({
		checked: writable(was_initially_public),
		disabled: !canToggleVisibility
	});
	$: checked = checkbox.states.checked;
	$: input = checkbox.elements.input;
	$: root = checkbox.elements.root;

	const queryClient = useQueryClient();

	async function toggleVisibility(
		outputIds: string[],
		newVisibility: 'make-public' | 'make-private'
	) {
		try {
			const res = await fetch(
				`${apiUrl.origin}/v1/user/image/generation/outputs/${
					newVisibility === 'make-public' ? 'make_public' : 'make_private'
				}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${$sessionStore?.access_token}`
					},
					body: JSON.stringify({ generation_output_ids: outputIds })
				}
			);
			if (!res.ok) {
				checked.set(was_initially_public);
				throw new Error('Response not ok');
			}
			outputIds.forEach((id) => {
				const props = {
					'SC - Advanced Mode': $advancedModeApp,
					'SC - App Version': $appVersion,
					'SC - Locale': $locale,
					'SC - Output Id': id,
					'SC - Page': `${$page.url.pathname}${$page.url.search}`,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - User Id': $sessionStore?.user.id,
					'SC - Generation Id': generation.id
				};
				if (newVisibility === 'make-private') {
					logGenerationOutputMadePrivate(props);
				} else {
					logGenerationOutputMadePublic(props);
				}
			});
			if (
				modalType === 'history' ||
				modalType === 'generate' ||
				modalType === 'stage' ||
				modalType === 'user-profile'
			) {
				const updateFunction = (data: any) => {
					return {
						...data,
						pages: data.pages.map((page: TGalleryFullOutputsPage) => {
							return {
								...page,
								outputs: page.outputs.map((output) =>
									outputIds.includes(output.id) ? { ...output, is_public: $checked } : output
								)
							};
						})
					};
				};
				const otherProfileQueryKey = getUserProfileInfiniteQueryKey({
					searchString: undefined,
					modelIdFilters: undefined,
					username: $userSummary?.username || ''
				});
				const hasInitialData1 = queryClient.getQueryData($historyFullOutputsQueryKey) !== undefined;
				const hasInitialData2 =
					queryClient.getQueryData($generatePageHistoryFullOutputsQueryKey) !== undefined;
				const hasInitialData3 = queryClient.getQueryData(otherProfileQueryKey) !== undefined;
				if (hasInitialData1) {
					queryClient.setQueryData($historyFullOutputsQueryKey, updateFunction);
				}
				if (hasInitialData2) {
					queryClient.setQueryData($generatePageHistoryFullOutputsQueryKey, updateFunction);
				}
				if (hasInitialData3) {
					queryClient.setQueryData(otherProfileQueryKey, updateFunction);
				}
				outputIds.forEach((id) => {
					setGenerationOutputVisibility(id, $checked ? 'public' : 'private');
				});
			}
		} catch (error) {
			console.log('Error toggling visibility', error);
			checked.set(was_initially_public);
		}
	}
</script>

{#key generation.selected_output.id}
	<WithTooltip
		let:trigger
		let:triggerStoreValue
		color="bg-tertiary"
		title={$LL.Shared.ProFeatures.SubscribeTitle()}
		titleIcon={IconStar}
		paragraph={$LL.Shared.ProFeatures.ChangeVisibilityFeatureParagraph()}
		buttonHref="/pricing"
		buttonText={$LL.Pricing.SubscribeButton()}
		isActive={!canToggleVisibility}
	>
		<div
			tabindex="-1"
			use:trigger
			{...triggerStoreValue}
			class="w-full {!canToggleVisibility ? 'cursor-not-allowed' : ''}"
		>
			<button
				{...$root}
				use:root
				class="group relative -my-1.5 flex w-full items-center justify-between rounded-lg
				py-4 pl-5 pr-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:pl-6.5 md:pr-5"
				id="checkbox"
				disabled={!canToggleVisibility}
				on:click={() =>
					canToggleVisibility
						? toggleVisibility(
								[generation.selected_output.id],
								$checked ? 'make-public' : 'make-private'
							)
						: () => null}
			>
				{#if canToggleVisibility}
					<ButtonHoverEffect size="md" hoverFrom="left" />
				{/if}
				<label
					class="pointer-events-none relative flex min-w-0 flex-1
					items-center justify-start gap-2 font-semibold
					text-c-on-bg transition"
					for="checkbox"
				>
					<IconEyeOutline
						class="h-5 w-5 flex-shrink-0 transition {canToggleVisibility
							? 'not-touch:group-hover:text-c-primary'
							: ''}"
					/>
					<p
						class="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-left transition {canToggleVisibility
							? 'not-touch:group-hover:text-c-primary'
							: ''}"
					>
						{$LL.GenerationFullscreen.ShowOnProfileButton()}
					</p>
				</label>
				<input {...$input} use:input />
				<ToggleIndicator
					isToggled={$checked === 'indeterminate' ? false : $checked}
					disabled={false}
				/>
			</button>
		</div>
	</WithTooltip>
{/key}
