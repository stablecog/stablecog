<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import Button from '$components/buttons/Button.svelte';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import ShowHideButton from '$components/buttons/ShowHideButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconKey from '$components/icons/IconKey.svelte';
	import IconPlusThick from '$components/icons/IconPlusThick.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import AccountPageCard from '$routes/account/AccountPageCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { createUserToken, deleteUserToken, getUserTokens } from '$ts/queries/tokens';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';

	const maxAllowedTokenCount = 10;
	const maxTokenNameLength = 50;
	const tokenPlaceholderString = 'sc-...' + Array(4).fill('•').join('');

	$: tokensQuery = browser
		? createQuery(['user_tokens'], () =>
				getUserTokens({ access_token: $page.data.session?.access_token || '' })
		  )
		: undefined;

	$: createTokenMutation = browser
		? createMutation(
				['user_create_token'],
				({ name }: { name: string }) =>
					createUserToken({ access_token: $page.data.session?.access_token || '', name }),
				{
					onSuccess: (d) => {
						$tokensQuery?.refetch();
						modalType = 'created';
						tokenInputValue = d.token;
					}
				}
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

	$: isMaxAllowedTokenCountReached = $tokensQuery?.data?.length
		? $tokensQuery?.data?.length >= maxAllowedTokenCount
		: false;

	$: dateFormatter = new Intl.DateTimeFormat($locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	$: numberFormatter = new Intl.NumberFormat($locale, {
		style: 'decimal',
		maximumFractionDigits: 0
	});

	type TModalType = 'delete' | 'create' | 'created';

	let isModalOpen = false;
	let modalType: TModalType = 'create';
	let tokenToDelete: string | undefined = undefined;
	let tokenInputValue = '';
	let isTokenInputHidden = true;
	let tokenInput: HTMLInputElement;
	let isCopiedOnce = false;

	function openModal({ type, id }: { type: TModalType; id?: string }) {
		modalType = type;
		if (type === 'delete' && id !== undefined) {
			tokenToDelete = id;
		}
		isModalOpen = true;
	}

	function resetModal() {
		isModalOpen = false;
		modalType = 'create';
		tokenToDelete = undefined;
		tokenInputValue = '';
		isCopiedOnce = false;
		isTokenInputHidden = true;
	}
</script>

<MetaTag
	title="API Keys | Account"
	description="Manage your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/account-{previewImageVersion}.png"
/>

<div class="w-full flex justify-center pt-4 md:pt-6 pb-12">
	<div class="w-full max-w-4xl flex flex-col">
		<p class="leading-relaxed mb-4 md:mb-6 px-5">
			{$LL.Account.APIKeys.PageParagraph()}
		</p>
		{#if !isMaxAllowedTokenCountReached}
			<div class="w-full flex mb-4 px-3">
				<Button size="sm" onClick={() => openModal({ type: 'create' })}>
					<div class="flex items-center gap-1.5">
						<IconPlusThick class="w-4 h-4 flex-shrink-0 -ml-1" />
						<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
							{$LL.Account.APIKeys.CreateNewKeyButton()}
						</p>
					</div>
				</Button>
			</div>
		{/if}
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
						<IconKey class="w-10 h-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary text-c-on-bg/50 mt-2 text-center">
							{$LL.Account.APIKeys.NoKeysYet()}
						</p>
					</div>
				{:else}
					<div class="w-full flex flex-col text-sm md:text-base min-w-[45rem]">
						<div class="w-full flex items-center font-semibold border-b-2 border-c-bg-secondary">
							<div class="flex-1 flex items-center min-w-0">
								<p class="flex-1 px-4 py-3.5 w-1/5">
									{$LL.Account.APIKeys.KeyTable.NameTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/5">
									{$LL.Account.APIKeys.KeyTable.KeyTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/5">
									{$LL.Account.APIKeys.KeyTable.CreatedAtTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/5">
									{$LL.Account.APIKeys.KeyTable.LastUsedTitle()}
								</p>
								<p class="flex-1 px-4 py-3.5 w-1/5">
									{$LL.Account.APIKeys.KeyTable.UsageTitle()}
								</p>
							</div>
							<div class="w-12 h-10 flex-shrink-0" />
						</div>
						{#each $tokensQuery.data as token, index (token.id)}
							<div
								transition:expandCollapse|local={{ duration: 200, easing: quadOut }}
								class="w-full flex flex-col justify-start items-start overflow-hidden"
							>
								<div
									class="w-full flex items-center text-c-on-bg/75 {index !==
									$tokensQuery.data.length - 1
										? 'border-b-2'
										: ''} border-c-bg-secondary"
								>
									<div class="flex-1 flex items-center min-w-0">
										<p class="flex-1 px-4 py-3.5 w-1/5">
											{token.name}
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/5 font-mono group">
											<span class="hidden group-hover:inline group-focus-within:inline"
												>{token.short_string}</span
											>
											<span class="inline group-hover:hidden group-focus-within:hidden"
												>{tokenPlaceholderString}</span
											>
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/5 text-c-on-bg/50">
											{dateFormatter.format(new Date(token.created_at))}
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/5 text-c-on-bg/50">
											{token.last_used_at
												? getRelativeDate({ date: token.last_used_at, locale: $locale })
												: $LL.Account.APIKeys.KeyTable.LastUsedNeverDescription()}
										</p>
										<p class="flex-1 px-4 py-3.5 w-1/5 text-c-on-bg/50">
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
				callback: () =>
					$createTokenMutation?.isLoading ||
					$deleteTokenMutation?.isLoading ||
					(modalType === 'created' && !isCopiedOnce)
						? null
						: resetModal()
			}}
			class="max-w-full my-auto"
		>
			<div
				class="w-full max-w-lg bg-c-bg ring-2 ring-c-bg-secondary rounded-xl p-5 md:p-6
				shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)]"
			>
				<h1
					class="font-bold text-xl -mt-1 {modalType === 'delete'
						? 'text-c-danger'
						: 'text-c-on-bg'}"
				>
					{#if modalType === 'delete'}
						{$LL.Account.APIKeys.KeyModal.Delete.Title()}
					{:else if modalType === 'created'}
						{$LL.Account.APIKeys.KeyModal.Created.Title()}
					{:else}
						{$LL.Account.APIKeys.KeyModal.Create.Title()}
					{/if}
				</h1>
				<p class="mt-3 text-c-on-bg/75 leading-relaxed">
					{#if modalType === 'delete'}
						{$LL.Account.APIKeys.KeyModal.Delete.Paragraph()}
					{:else if modalType === 'created'}
						{$LL.Account.APIKeys.KeyModal.Created.Paragraph()}
					{:else}
						{$LL.Account.APIKeys.KeyModal.Create.Paragraph()}
					{/if}
				</p>
				<form
					class="flex-1 min-w-0"
					on:submit|preventDefault={() => {
						modalType === 'delete'
							? $deleteTokenMutation?.mutate({ id: tokenToDelete || '' })
							: modalType === 'created'
							? resetModal()
							: $createTokenMutation?.mutate({ name: tokenInputValue });
						tokenInput?.blur();
					}}
				>
					{#if modalType === 'create' || modalType === 'created'}
						<div class="w-full flex items-center gap-2 mt-6">
							<Input
								class="flex-1 min-w-0"
								type={modalType === 'created' && isTokenInputHidden ? 'password' : 'text'}
								readonly={modalType === 'created' ? true : undefined}
								title={modalType === 'created'
									? $LL.Account.APIKeys.KeyModal.Created.Input.Title()
									: $LL.Account.APIKeys.KeyModal.Create.Input.TitleAlt()}
								bind:inputElement={tokenInput}
								bind:value={tokenInputValue}
								noAutocomplete
								maxLength={modalType === 'create' ? maxTokenNameLength : undefined}
							/>
							{#if modalType === 'created'}
								<div class="flex flex-shrink-0 items-center justify-end">
									<ShowHideButton bind:isHidden={isTokenInputHidden} />
									<CopyButton
										onCopied={() => (isCopiedOnce = true)}
										stringToCopy={tokenInputValue}
									/>
								</div>
							{/if}
						</div>
					{/if}
					<div class="w-full flex flex-wrap justify-end items-stretch mt-6 gap-2">
						{#if modalType !== 'created'}
							<Button
								disabled={$createTokenMutation?.isLoading || $deleteTokenMutation?.isLoading}
								onClick={resetModal}
								size="sm"
								type="no-bg-on-bg"
								buttonType="button"
							>
								{$LL.Shared.CancelButton()}
							</Button>
						{/if}
						<Button
							withSpinner
							loading={$createTokenMutation?.isLoading || $deleteTokenMutation?.isLoading}
							size="sm"
							type={modalType === 'delete' ? 'danger' : 'primary'}
							buttonType="submit"
						>
							{#if modalType === 'delete'}
								{$LL.Account.APIKeys.KeyModal.Delete.RevokeKeyButton()}
							{:else if modalType === 'created'}
								{$LL.Shared.DoneButton()}
							{:else}
								{$LL.Account.APIKeys.KeyModal.Create.CreateKeyButton()}
							{/if}
						</Button>
					</div>
				</form>
			</div>
			<div class="w-full h-[5vh] pointer-events-none" />
		</div>
	</ModalWrapper>
{/if}
