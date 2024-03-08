<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/primitives/buttons/Button.svelte';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import ErrorLine from '$components/error/ErrorLine.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import Input from '$components/primitives/Input.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { quadOut } from 'svelte/easing';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import { supabaseStore } from '$ts/constants/supabase';

	export let data;

	let email: string;
	let changeEmailStatus: 'idle' | 'loading' | 'error' | 'sent-otp' | 'confirm-other-email' =
		data.confirm_other_email ? 'confirm-other-email' : 'idle';
	let errorText: string | null = null;

	async function changeEmail() {
		if (!$supabaseStore) return;
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		changeEmailStatus = 'loading';
		const domain = email.split('@')[1];
		const { data: dData, error: dError } = await $supabaseStore
			.from('disposable_emails')
			.select('domain')
			.eq('domain', domain);
		if (dError) {
			console.log(dError);
			errorText = $LL.Error.SomethingWentWrong();
			changeEmailStatus = 'error';
			return;
		}
		if (dData.length > 0) {
			errorText = $LL.Error.EmailProviderNotAllowed();
			changeEmailStatus = 'error';
			return;
		}
		const { data: sData, error: sError } = await $supabaseStore.auth.updateUser({
			email
		});
		if (sError) {
			console.log(sError);
			changeEmailStatus = 'error';
			if (
				sError.message === 'For security purposes, you can only request this once every 60 seconds'
			) {
				errorText = $LL.Error.OnceEvery60Seconds();
			} else if (sError.message === 'A user with this email address has already been registered') {
				errorText = $LL.Error.EmailAlreadyInUse();
			} else {
				errorText = $LL.Error.SomethingWentWrong();
			}
			return;
		}
		console.log(sData);
		changeEmailStatus = 'sent-otp';
	}
</script>

<MetaTag
	title="Change Email | Stablecog"
	description="Change your account's email address on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-center">
		<div
			class="relative z-10 flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-3xl bg-c-bg
				px-3 py-4 shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-secondary md:p-7"
		>
			{#if changeEmailStatus === 'sent-otp' || changeEmailStatus === 'confirm-other-email'}
				<div class="mb-2">
					<IconEmail class="h-20 w-20 text-c-on-bg" />
				</div>
			{/if}
			<h1 class="mt-1 w-full px-8 text-center text-2xl font-bold leading-normal md:-mt-2">
				{changeEmailStatus === 'sent-otp'
					? $LL.Account.ChangeEmail.PageTitleSentLink()
					: changeEmailStatus === 'confirm-other-email'
						? $LL.Account.ChangeEmail.PageTitleConfirmOtherEmail()
						: $LL.Account.ChangeEmail.PageTitle()}
			</h1>
			<div class="mt-1.5 flex w-full flex-col items-center justify-start">
				<p
					class="mb-4 w-full px-4 text-center leading-relaxed text-c-on-bg/60 {changeEmailStatus ===
					'sent-otp'
						? 'mt-1'
						: ''}"
				>
					{changeEmailStatus === 'sent-otp'
						? $LL.Account.ChangeEmail.PageParagraphSentLink()
						: changeEmailStatus === 'confirm-other-email'
							? $LL.Account.ChangeEmail.PageParagraphConfirmOtherEmail()
							: $LL.Account.ChangeEmail.PageParagraph()}
				</p>
				{#if changeEmailStatus === 'sent-otp' || changeEmailStatus === 'confirm-other-email'}
					<div
						class="relative z-0 -mx-5 -mb-4 mt-4 flex w-[calc(100%+1.5rem)] flex-col items-center justify-start
						border-t-2 border-c-bg-secondary md:-mx-10 md:-mb-7 md:mt-6 md:w-[calc(100%+5rem)]"
					>
						<DropdownItem onClick={() => (changeEmailStatus = 'idle')}>
							<div class="flex w-full items-center justify-center gap-2.5">
								<IconBack
									class="h-6 w-6 text-c-on-bg/60 transition not-touch:group-hover:text-c-primary"
								/>
								<p class="text-c-on-bg/60 transition not-touch:group-hover:text-c-primary">
									{$LL.Shared.GoBackButton()}
								</p>
							</div>
						</DropdownItem>
					</div>
				{:else}
					<div
						transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
						class="relative z-0 flex w-full flex-col items-center justify-start"
					>
						<form
							on:input={() => (errorText = null)}
							on:submit|preventDefault={changeEmail}
							class="flex w-full flex-col p-1 md:pb-2"
						>
							<Input
								disabled={changeEmailStatus === 'loading'}
								type="email"
								title={$LL.Account.ChangeEmail.NewEmailInput.Placeholder()}
								bind:value={email}
								hasIcon
							>
								<IconEmail slot="icon" class="h-full w-full" />
							</Input>
							{#if errorText}
								<ErrorLine text={errorText} class="-mt-1 text-xs" />
							{/if}
							<Button class="mt-3" loading={changeEmailStatus === 'loading'} withSpinner>
								{$LL.Shared.ContinueButton()}
							</Button>
						</form>
					</div>
				{/if}
			</div>
		</div>
		{#if changeEmailStatus === 'idle'}
			<div class="flex w-full items-center justify-center pt-3">
				<NoBgButton href="/account">
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="h-6 w-6 transform text-c-on-bg/50 transition group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
						/>
						<p class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary">
							{$LL.Shared.GoBackButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
		{/if}
	</div>
</PageWrapper>
