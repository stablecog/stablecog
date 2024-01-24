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

	let isModalOpen = false;
	let tokenToDelete: string | undefined = undefined;

	$: tokensQuery = browser
		? createQuery(['user_apps'], () =>
				getUserTokens({ access_token: $page.data.session?.access_token || '', type: 'client' })
		  )
		: undefined;

	$: deleteTokenMutation = browser
		? createMutation(
				['user_delete_token'],
				({ id }: { id: string }) =>
					deleteUserToken({ access_token: $page.data.session?.access_token || '', id }),
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

<div class="w-full flex justify-center pt-4 md:pt-6 pb-6 md:pb-8 md:px-3">
	<div class="w-full max-w-4xl flex flex-col">
		<p class="leading-relaxed mb-4 md:mb-6 px-5">
			{$LL.Account.Apps.PageParagraph()}
		</p>
		<div class="w-full px-3">
			<AccountPageCard>
				{#if $tokensQuery?.isError}
					<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
						<IconSadFaceOutline class="w-10 h-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
							{$LL.Error.SomethingWentWrong()}
						</p>
					</div>
				{:else if $tokensQuery === undefined || $tokensQuery.data === undefined || $tokensQuery?.isInitialLoading}
					<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
						<IconAnimatedSpinner class="w-10 h-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
							{$LL.Shared.LoadingTitle()}
						</p>
					</div>
				{:else if $tokensQuery.data.length === 0}
					<div class="w-full flex flex-col items-center justify-center py-8 px-5 md:px-12">
						<IconGrid class="w-10 h-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
							{$LL.Account.Apps.NoAppsYet()}
						</p>
					</div>
				{:else}
					<div class="w-full flex flex-col text-sm md:text-base min-w-[36rem]">
						<div class="w-full flex items-center font-semibold border-b-2 border-c-bg-secondary">
							<div class="flex-1 flex items-center min-w-0">
								<p class="flex-1 px-4 py-3.5 w-1/4">
									{$LL.Account.APIKeys.KeyTable.NameTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/4">
									{$LL.Account.Apps.KeyTable.ConnectedAtTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/4">
									{$LL.Account.APIKeys.KeyTable.LastUsedTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/4">
									{$LL.Account.APIKeys.KeyTable.UsageTitle()}
								</p>
							</div>
							<div class="w-12 h-10 flex-shrink-0" />
						</div>
						{#each $tokensQuery.data as token, index (token.id)}
							<div
								transition:expandCollapse={{ duration: 200, easing: quadOut }}
								class="w-full flex flex-col justify-start items-start overflow-hidden"
							>
								<div
									class="w-full flex items-center text-c-on-bg/75 {index !==
									$tokensQuery.data.length - 1
										? 'border-b-2'
										: ''} border-c-bg-secondary"
								>
									<div class="flex-1 flex items-center min-w-0">
										<div class="flex-1 px-4 py-3.5 w-1/4 flex items-center gap-1.5 md:gap-2">
											<IconSc
												class="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
												type={getAppFromAppId(token.auth_client_id, $LL)?.icon || 'unknown'}
											/>
											<p class="flex-shrink min-w-0">
												{getAppFromAppId(token.auth_client_id, $LL)?.localizedName ||
													$LL.Shared.UnknownTitle()}
											</p>
										</div>
										<p class="flex-1 px-4 py-3.5 w-1/4 text-c-on-bg/50">
											{dateFormatter.format(new Date(token.created_at))}
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/4 text-c-on-bg/50">
											{token.last_used_at
												? getRelativeDate({ date: token.last_used_at, locale: $locale })
												: $LL.Account.APIKeys.KeyTable.LastUsedNeverDescription()}
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/4 text-c-on-bg/50">
											{numberFormatter.format(token.uses)}
										</p>
									</div>
									<div class="px-1 flex items-center justify-center">
										<IconButton
											name={$LL.Account.APIKeys.DeleteKeyButton()}
											onClick={() => openModal({ type: 'delete', id: token.id })}
										>
											<IconTrashcan
												class="w-6 h-6 transition text-c-on-bg/75 group-hover/iconbutton:text-c-primary"
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
			class="max-w-full my-auto"
		>
			<div
				class="w-full max-w-lg bg-c-bg ring-2 ring-c-bg-secondary rounded-xl p-5 md:p-6
				shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)]"
			>
				<div class="w-full flex flex-row flex-wrap items-center gap-3">
					<h1 class="font-bold text-xl -mt-1 text-c-danger">
						{$LL.Account.Apps.AppModal.Delete.Title()}
					</h1>
					{#if $tokensQuery?.data?.find((i) => i.id === tokenToDelete)}
						<div
							class="max-w-full flex -mt-1 items-center justify-start gap-1.5 bg-c-danger/15 text-c-danger
								rounded-md px-2.5 py-1 text-sm font-medium"
						>
							<IconSc
								type={getAppFromAppId(
									$tokensQuery?.data?.find((i) => i.id === tokenToDelete)?.auth_client_id,
									$LL
								)?.icon || 'unknown'}
								class="w-4 h-4 -ml-0.5 flex-shrink-0"
							/>
							<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
								{getAppFromAppId(
									$tokensQuery?.data?.find((i) => i.id === tokenToDelete)?.auth_client_id,
									$LL
								)?.localizedName || $LL.Shared.UnknownTitle()}
							</p>
						</div>
					{/if}
				</div>
				<p class="mt-3 text-c-on-bg/75 leading-relaxed">
					{$LL.Account.Apps.AppModal.Delete.Paragraph()}
				</p>
				<form
					class="flex-1 min-w-0"
					on:submit|preventDefault={() => {
						$deleteTokenMutation?.mutate({ id: tokenToDelete || '' });
					}}
				>
					<div class="w-full flex flex-wrap justify-end items-stretch mt-6 gap-2">
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
			<div class="w-full h-[5vh] pointer-events-none" />
		</div>
	</ModalWrapper>
{/if}
