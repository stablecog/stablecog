<script lang="ts">
	import { page } from '$app/stores';
	import ToggleIndicator from '$components/ToggleIndicator.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import type { TGenerationFullScreenModalType } from '$components/generationFullScreen/types';
	import IconShare from '$components/icons/IconShare.svelte';
	import LL from '$i18n/i18n-svelte';
	import { getSomeUserProfileInfiniteQueryKey } from '$routes/(app)/user/[username]/constants';
	import { apiUrl } from '$ts/constants/main';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { globalSeed } from '$ts/stores/globalSeed';
	import {
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

	export let modalType: TGenerationFullScreenModalType;
	export let generation: TGenerationWithSelectedOutput;

	$: was_initially_public = generation.selected_output.is_public ? true : false;
	$: canToggleVisibility =
		($userSummary?.product_id !== undefined && $userSummary?.product_id !== null) ||
		isSuperAdmin($userSummary?.roles);
	$: checkbox = createCheckbox({
		checked: was_initially_public,
		disabled: !canToggleVisibility
	});
	$: checked = checkbox.checked;
	$: input = checkbox.input;
	$: root = checkbox.root;

	const queryClient = useQueryClient();

	async function toggleVisibility(outputIds: string[]) {
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/gallerya`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({ generation_output_ids: outputIds })
			});
			if (!res.ok) {
				checked.set(was_initially_public);
				throw new Error('Response not ok');
			}
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
									outputIds.includes(output.id) ? { ...output, is_public: checked } : output
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
					setGenerationOutputVisibility(id, checked ? 'public' : 'private');
				});
			}
		} catch (error) {
			console.log('Error toggling visibility', error);
			checked.set(was_initially_public);
		}
	}
</script>

<button
	{...$root}
	use:root
	disabled={!canToggleVisibility}
	class="w-full flex items-center justify-between rounded-lg pl-5 md:pl-6.5 pr-4
    md:pr-5 py-4 relative cursor-pointer group -my-1.5 {canToggleVisibility
		? ''
		: 'cursor-not-allowed'}"
	id="checkbox"
	on:click={() => toggleVisibility([generation.selected_output.id])}
>
	{#if canToggleVisibility}
		<ButtonHoverEffect size="md" hoverFrom="left" />
	{/if}
	<label
		class="font-semibold flex gap-2 justify-start items-center
      flex-1 min-w-0 relative cursor-pointer pointer-events-none
      transition text-c-on-bg group-enabled:not-touch:group-hover:text-c-primary"
		for="checkbox"
	>
		<IconShare class="flex-shrink-0 w-5 h-5" />
		<p class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-left">
			{$LL.GenerationFullscreen.ShowOnProfileButton()}
		</p>
	</label>
	<input {...$input} use:input />
	<ToggleIndicator
		isToggled={$checked === 'indeterminate' ? false : $checked}
		disabled={!canToggleVisibility}
	/>
</button>
