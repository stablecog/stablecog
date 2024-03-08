<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ModalWrapper from '$components/modals/ModalWrapper.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconKey from '$components/icons/IconKey.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import AccountPageCard from '$approutes/account/AccountPageCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { deleteUserToken, getUserTokens } from '$ts/queries/tokens';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import IconSc from '$components/icons/IconSc.svelte';
	import { getAppFromAppId } from '$routes/(app)/account/apps/helpers';
	import IconGrid from '$components/icons/IconGrid.svelte';
	import { sessionStore } from '$ts/constants/supabase';

	let isModalOpen = false;
	let tokenToDelete: string | undefined = undefined;

	$: tokensQuery = browser
		? createQuery(['user_apps'], () =>
				getUserTokens({ access_token: $sessionStore?.access_token || '', type: 'client' })
			)
		: undefined;

	$: deleteTokenMutation = browser
		? createMutation(
				['user_delete_token'],
				({ id }: { id: string }) =>
					deleteUserToken({ access_token: $sessionStore?.access_token || '', id }),
				{
					onSuccess: () => {
						$tokensQuery?.refetch();
						resetModal();
					}
				}
			)
		: undefined;

	$: dateFormatter = new Intl.DateTimeFormat($locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});

	type TModalType = 'delete';

	function openModal({ type, id }: { type: TModalType; id?: string }) {
		tokenToDelete = id;
		isModalOpen = true;
	}

	function resetModal() {
		isModalOpen = false;
		tokenToDelete = undefined;
	}
</script>

<MetaTag
	title="Applications | Account"
	description="Manage the applications that you've connect to your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/account-{previewImageVersion}.png"
/>

<div class="flex w-full justify-center pb-6 pt-4 md:px-3 md:pb-8 md:pt-6">
	<div class="flex w-full max-w-4xl flex-col">
		<p class="mb-4 px-5 leading-relaxed md:mb-6">
			{$LL.Account.Apps.PageParagraph()}
		</p>
		<div class="w-full px-3">
			<AccountPageCard>
				{#if $tokensQuery?.isError}
					<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
						<IconSadFaceOutline class="h-10 w-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
							{$LL.Error.SomethingWentWrong()}
						</p>
					</div>
				{:else if $tokensQuery === undefined || $tokensQuery.data === undefined || $tokensQuery?.isInitialLoading}
					<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
						<IconAnimatedSpinner class="h-10 w-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
							{$LL.Shared.LoadingTitle()}
						</p>
					</div>
				{:else if $tokensQuery.data.length === 0}
					<div class="flex w-full flex-col items-center justify-center px-5 py-8 md:px-12">
						<IconGrid class="h-10 w-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
							{$LL.Account.Apps.NoAppsYet()}
						</p>
					</div>
				{:else}
					<div class="flex w-full min-w-[36rem] flex-col text-sm md:text-base">
						<div class="flex w-full items-center border-b-2 border-c-bg-secondary font-semibold">
							<div class="flex min-w-0 flex-1 items-center">
								<p class="w-1/4 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.NameTitle()}
								</p>
								<p class="w-1/4 flex-1 px-4 py-3.5">
									{$LL.Account.Apps.KeyTable.ConnectedAtTitle()}
								</p>
								<p class="w-1/4 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.LastUsedTitle()}
								</p>
								<p class="w-1/4 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.UsageTitle()}
								</p>
							</div>
							<div class="h-10 w-12 flex-shrink-0" />
						</div>
						{#each $tokensQuery.data as token, index (token.id)}
							<div
								transition:expandCollapse={{ duration: 200, easing: quadOut }}
								class="flex w-full flex-col items-start justify-start overflow-hidden"
							>
								<div
									class="flex w-full items-center text-c-on-bg/75 {index !==
									$tokensQuery.data.length - 1
										? 'border-b-2'
										: ''} border-c-bg-secondary"
								>
									<div class="flex min-w-0 flex-1 items-center">
										<div class="flex w-1/4 flex-1 items-center gap-1.5 px-4 py-3.5 md:gap-2">
											<IconSc
												class="h-5 w-5 flex-shrink-0 md:h-6 md:w-6"
												type={getAppFromAppId(token.auth_client_id, $LL)?.icon || 'unknown'}
											/>
											<p class="min-w-0 flex-shrink">
												{getAppFromAppId(token.auth_client_id, $LL)?.localizedName ||
													$LL.Shared.UnknownTitle()}
											</p>
										</div>
										<p class="w-1/4 flex-1 px-4 py-3.5 text-c-on-bg/50">
											{dateFormatter.format(new Date(token.created_at))}
										</p>
										<p class="w-1/4 flex-1 px-4 py-3.5 text-c-on-bg/50">
											{token.last_used_at
												? getRelativeDate({ date: token.last_used_at, locale: $locale })
												: $LL.Account.APIKeys.KeyTable.LastUsedNeverDescription()}
										</p>
										<p class="w-1/4 flex-1 px-4 py-3.5 text-c-on-bg/50">
											{numberFormatter.format(token.uses)}
										</p>
									</div>
									<div class="flex items-center justify-center px-1">
										<IconButton
											name={$LL.Account.APIKeys.DeleteKeyButton()}
											onClick={() => openModal({ type: 'delete', id: token.id })}
										>
											<IconTrashcan
												class="h-6 w-6 text-c-on-bg/75 transition group-hover/iconbutton:text-c-primary"
											/>
										</IconButton>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</AccountPageCard>
		</div>
	</div>
</div>

{#if isModalOpen}
	<ModalWrapper>
		<div
			use:clickoutside={{
				callback: () => ($deleteTokenMutation?.isLoading ? null : resetModal())
			}}
			class="my-auto max-w-full"
		>
			<div
				class="w-full max-w-lg rounded-xl bg-c-bg p-5 shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2
				ring-c-bg-secondary md:p-6"
			>
				<div class="flex w-full flex-row flex-wrap items-center gap-3">
					<h1 class="-mt-1 text-xl font-bold text-c-danger">
						{$LL.Account.Apps.AppModal.Delete.Title()}
					</h1>
					{#if $tokensQuery?.data?.find((i) => i.id === tokenToDelete)}
						<div
							class="-mt-1 flex max-w-full items-center justify-start gap-1.5 rounded-md bg-c-danger/15
								px-2.5 py-1 text-sm font-medium text-c-danger"
						>
							<IconSc
								type={getAppFromAppId(
									$tokensQuery?.data?.find((i) => i.id === tokenToDelete)?.auth_client_id,
									$LL
								)?.icon || 'unknown'}
								class="-ml-0.5 h-4 w-4 flex-shrink-0"
							/>
							<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">
								{getAppFromAppId(
									$tokensQuery?.data?.find((i) => i.id === tokenToDelete)?.auth_client_id,
									$LL
								)?.localizedName || $LL.Shared.UnknownTitle()}
							</p>
						</div>
					{/if}
				</div>
				<p class="mt-3 leading-relaxed text-c-on-bg/75">
					{$LL.Account.Apps.AppModal.Delete.Paragraph()}
				</p>
				<form
					class="min-w-0 flex-1"
					on:submit|preventDefault={() => {
						$deleteTokenMutation?.mutate({ id: tokenToDelete || '' });
					}}
				>
					<div class="mt-6 flex w-full flex-wrap items-stretch justify-end gap-2">
						<Button
							disabled={$deleteTokenMutation?.isLoading}
							onClick={resetModal}
							size="sm"
							type="no-bg-on-bg"
							buttonType="button"
						>
							{$LL.Shared.CancelButton()}
						</Button>
						<Button
							withSpinner
							loading={$deleteTokenMutation?.isLoading}
							size="sm"
							type="danger"
							buttonType="submit"
						>
							{$LL.Account.Apps.AppModal.Delete.RevokeAccessButton()}
						</Button>
					</div>
				</form>
			</div>
			<div class="pointer-events-none h-[5vh] w-full" />
		</div>
	</ModalWrapper>
{/if}
