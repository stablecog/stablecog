<script lang="ts">
	import { browser } from '$app/environment';
	import Input from '$components/primitives/Input.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import ModalWrapper from '$components/modals/ModalWrapper.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import CopyButton from '$components/primitives/buttons/CopyButton.svelte';
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import ShowHideButton from '$components/primitives/buttons/ShowHideButton.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconKey from '$components/icons/IconKey.svelte';
	import IconPlusThick from '$components/icons/IconPlusThick.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import AccountPageCard from '$approutes/account/AccountPageCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { createUserToken, deleteUserToken, getUserTokens } from '$ts/queries/tokens';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import IconCommandLineOutlined from '$components/icons/IconCommandLineOutlined.svelte';
	import { sessionStore } from '$ts/constants/supabase';

	const maxAllowedTokenCount = 10;
	const maxTokenNameLength = 50;
	const tokenPlaceholderString = 'sc-...' + Array(4).fill('•').join('');

	let isModalOpen = false;
	let modalType: TModalType = 'create';
	let tokenToDelete: string | undefined = undefined;
	let tokenInputValue = '';
	let lastTokenName: undefined | string;
	let isTokenInputHidden = true;
	let tokenInput: HTMLInputElement;
	let isCopiedOnce = false;

	$: tokensQuery = browser
		? createQuery(['user_tokens'], () =>
				getUserTokens({ access_token: $sessionStore?.access_token || '', type: 'manual' })
			)
		: undefined;

	$: createTokenMutation = browser
		? createMutation(
				['user_create_token'],
				({ name }: { name: string }) =>
					createUserToken({ access_token: $sessionStore?.access_token || '', name }),
				{
					onSuccess: (d) => {
						$tokensQuery?.refetch();
						modalType = 'created';
						tokenInputValue = d.token;
					},
					onMutate: (d) => {
						lastTokenName = d.name;
					}
				}
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

<div class="flex w-full justify-center pb-6 pt-4 md:px-3 md:pb-8 md:pt-6">
	<div class="flex w-full max-w-4xl flex-col">
		<p class="mb-4 px-5 leading-relaxed md:mb-6">
			{$LL.Account.APIKeys.PageParagraph()}
		</p>
		{#if !isMaxAllowedTokenCountReached}
			<div class="mb-4 flex w-full flex-wrap gap-3 px-3">
				<Button size="sm" onClick={() => openModal({ type: 'create' })}>
					<div class="flex items-center gap-1.5">
						<IconPlusThick class="-ml-1 h-4 w-4 flex-shrink-0" />
						<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">
							{$LL.Account.APIKeys.CreateNewKeyButton()}
						</p>
					</div>
				</Button>
				<Button
					icon={IconCommandLineOutlined}
					type="bg-secondary"
					size="sm"
					href="/docs/v1"
					target="_blank"
				>
					<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">
						{$LL.Documentation.DocumentationButton()}
					</p>
				</Button>
			</div>
		{/if}
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
						<IconKey class="h-10 w-10 text-c-on-bg/50" />
						<p class="text-c-on-surface-secondary mt-2 text-center text-c-on-bg/50">
							{$LL.Account.APIKeys.NoKeysYet()}
						</p>
					</div>
				{:else}
					<div class="flex w-full min-w-[45rem] flex-col text-sm md:text-base">
						<div class="flex w-full items-center border-b-2 border-c-bg-secondary font-semibold">
							<div class="flex min-w-0 flex-1 items-center">
								<p class="w-1/5 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.NameTitle()}
								</p>
								<p class="w-1/5 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.KeyTitle()}
								</p>
								<p class="w-1/5 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.CreatedAtTitle()}
								</p>
								<p class="w-1/5 flex-1 px-4 py-3.5">
									{$LL.Account.APIKeys.KeyTable.LastUsedTitle()}
								</p>
								<p class="w-1/5 flex-1 px-4 py-3.5">
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
										<p class="w-1/5 flex-1 px-4 py-3.5">
											{token.name}
										</p>
										<p class="group w-1/5 flex-1 px-4 py-3.5 font-mono">
											<span class="hidden group-focus-within:inline group-hover:inline"
												>{token.short_string}</span
											>
											<span class="inline group-focus-within:hidden group-hover:hidden"
												>{tokenPlaceholderString}</span
											>
										</p>
										<p class="w-1/5 flex-1 px-4 py-3.5 text-c-on-bg/50">
											{dateFormatter.format(new Date(token.created_at))}
										</p>
										<p class="w-1/5 flex-1 px-4 py-3.5 text-c-on-bg/50">
											{token.last_used_at
												? getRelativeDate({ date: token.last_used_at, locale: $locale })
												: $LL.Account.APIKeys.KeyTable.LastUsedNeverDescription()}
										</p>
										<p class="w-1/5 flex-1 px-4 py-3.5 text-c-on-bg/50">
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
				callback: () =>
					$createTokenMutation?.isLoading ||
					$deleteTokenMutation?.isLoading ||
					(modalType === 'created' && !isCopiedOnce)
						? null
						: resetModal()
			}}
			class="my-auto max-w-full"
		>
			<div
				class="w-full max-w-lg rounded-xl bg-c-bg p-5 shadow-2xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2
				ring-c-bg-secondary md:p-6"
			>
				<div class="flex w-full flex-row flex-wrap items-center gap-3">
					<h1
						class="-mt-1 text-xl font-bold {modalType === 'delete'
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
					{#if (modalType === 'delete' && $tokensQuery?.data?.find((i) => i.id === tokenToDelete)) || (modalType === 'created' && lastTokenName)}
						<div
							class="-mt-1 flex max-w-full items-center justify-start gap-1.5 {modalType ===
							'created'
								? 'bg-c-on-bg/10 text-c-on-bg'
								: 'bg-c-danger/15 text-c-danger'}
								rounded-md px-2.5 py-1 text-sm font-medium"
						>
							<IconKey class="-ml-0.5 h-4 w-4 flex-shrink-0" />
							<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">
								{modalType === 'created'
									? lastTokenName
									: $tokensQuery?.data?.find((i) => i.id === tokenToDelete)?.name}
							</p>
						</div>
					{/if}
				</div>
				<p class="mt-3 leading-relaxed text-c-on-bg/75">
					{#if modalType === 'delete'}
						{$LL.Account.APIKeys.KeyModal.Delete.Paragraph()}
					{:else if modalType === 'created'}
						{$LL.Account.APIKeys.KeyModal.Created.Paragraph()}
					{:else}
						{$LL.Account.APIKeys.KeyModal.Create.Paragraph()}
					{/if}
				</p>
				<form
					class="min-w-0 flex-1"
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
						<div class="mt-6 flex w-full items-center gap-2">
							<Input
								class="min-w-0 flex-1"
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
					<div class="mt-6 flex w-full flex-wrap items-stretch justify-end gap-2">
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
			<div class="pointer-events-none h-[5vh] w-full" />
		</div>
	</ModalWrapper>
{/if}
