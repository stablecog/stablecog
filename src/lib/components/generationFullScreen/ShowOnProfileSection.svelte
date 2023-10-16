<script lang="ts">
	import { page } from '$app/stores';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import WithTooltip from '$components/WithTooltip.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconShareAlt from '$components/icons/IconShareAlt.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { getSomeUserProfileInfiniteQueryKey } from '$routes/(app)/user/[username]/constants';
	import { apiUrl } from '$ts/constants/main';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import {
		logGenerationOutputMadePrivate,
		logGenerationOutputMadePublic
	} from '$ts/helpers/loggers';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { globalSeed } from '$ts/stores/globalSeed';
	import {
		generations,
		setGenerationOutputVisibility,
		type TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import {
		generatePageUserGenerationFullOutputsQueryKey,
		userGenerationFullOutputsQueryKey
	} from '$ts/stores/user/keys';
	import { userSummary } from '$ts/stores/user/summary';
	import { createCheckbox } from '@melt-ui/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';

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
		$userSummary?.product_id ||
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
						Authorization: `Bearer ${$page.data.session?.access_token}`
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
					'SC - User Id': $page.data.session?.user.id,
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
						pages: data.pages.map((page: TUserGenerationFullOutputsPage) => {
							return {
								...page,
								outputs: page.outputs.map((output) =>
									outputIds.includes(output.id) ? { ...output, is_public: $checked } : output
								)
							};
						})
					};
				};
				const otherProfileQueryKey = getSomeUserProfileInfiniteQueryKey({
					searchString: undefined,
					modelIdFilters: undefined,
					seed: $globalSeed,
					username: $userSummary?.username || ''
				});
				const hasInitialData1 =
					queryClient.getQueryData($userGenerationFullOutputsQueryKey) !== undefined;
				const hasInitialData2 =
					queryClient.getQueryData($generatePageUserGenerationFullOutputsQueryKey) !== undefined;
				const hasInitialData3 = queryClient.getQueryData(otherProfileQueryKey) !== undefined;
				if (hasInitialData1) {
					queryClient.setQueryData($userGenerationFullOutputsQueryKey, updateFunction);
				}
				if (hasInitialData2) {
					queryClient.setQueryData($generatePageUserGenerationFullOutputsQueryKey, updateFunction);
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
	<button
		{...$root}
		use:root
		disabled={!canToggleVisibility}
		class="w-full flex items-center justify-between rounded-lg pl-5 md:pl-6.5 pr-4
			md:pr-5 py-4 relative group -my-1.5 {canToggleVisibility
			? 'cursor-pointer'
			: 'cursor-not-allowed opacity-50'}"
		id="checkbox"
		on:click={() =>
			toggleVisibility([generation.selected_output.id], $checked ? 'make-public' : 'make-private')}
	>
		{#if canToggleVisibility}
			<ButtonHoverEffect size="md" hoverFrom="left" />
		{/if}
		<label
			class="font-semibold flex gap-2 justify-start items-center
				flex-1 min-w-0 relative pointer-events-none
				transition text-c-on-bg group-enabled:not-touch:group-hover:text-c-primary"
			for="checkbox"
		>
			<IconShareAlt class="flex-shrink-0 w-5 h-5" />
			<p class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-left">
				{$LL.GenerationFullscreen.ShowOnProfileButton()}
			</p>
		</label>
		<input {...$input} use:input />
		{#if canToggleVisibility}
			<ToggleIndicator
				isToggled={$checked === 'indeterminate' ? false : $checked}
				disabled={false}
			/>
		{:else}
			<WithTooltip
				let:trigger
				let:triggerStoreValue
				color="bg-tertiary"
				title={$LL.Shared.ProFeatures.SubscribeTitle()}
				titleIcon={IconStar}
				paragraph={$LL.Shared.ProFeatures.ChangeVisibilityFeatureParagraph()}
			>
				<div
					role="button"
					tabindex="0"
					use:trigger
					{...triggerStoreValue}
					class="flex justify-end items-center rounded-full cursor-not-allowed"
				>
					<ToggleIndicator
						isToggled={$checked === 'indeterminate' ? false : $checked}
						disabled={true}
					/>
				</div>
			</WithTooltip>
		{/if}
	</button>
{/key}