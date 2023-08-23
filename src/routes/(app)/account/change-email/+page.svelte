<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import DropdownItem from '$components/DropdownItem.svelte';
	import ErrorLine from '$components/error/ErrorLine.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { quadOut } from 'svelte/easing';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';

	export let data;

	let email: string;
	let changeEmailStatus: 'idle' | 'loading' | 'error' | 'sent-otp' | 'confirm-other-email' =
		data.confirm_other_email ? 'confirm-other-email' : 'idle';
	let errorText: string | null = null;

	async function changeEmail() {
		if (!$page.data.supabase) return;
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		changeEmailStatus = 'loading';
		const domain = email.split('@')[1];
		const { data: dData, error: dError } = await $page.data.supabase
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
		const { data: sData, error: sError } = await $page.data.supabase.auth.updateUser({
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
	<div class="w-full flex flex-col justify-center items-center my-auto">
		<div
			class="w-full max-w-md flex flex-col items-center justify-center bg-c-bg ring-c-bg-secondary ring-2 px-3 py-4
				md:p-7 rounded-3xl relative z-10 overflow-hidden shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			{#if changeEmailStatus === 'sent-otp' || changeEmailStatus === 'confirm-other-email'}
				<div class="mb-2">
					<IconEmail class="w-20 h-20 text-c-on-bg" />
				</div>
			{/if}
			<h1 class="w-full text-center font-bold leading-normal mt-1 md:-mt-2 text-2xl px-8">
				{changeEmailStatus === 'sent-otp'
					? $LL.Account.ChangeEmail.PageTitleSentLink()
					: changeEmailStatus === 'confirm-other-email'
					? $LL.Account.ChangeEmail.PageTitleConfirmOtherEmail()
					: $LL.Account.ChangeEmail.PageTitle()}
			</h1>
			<div class="w-full flex flex-col items-center justify-start mt-1.5">
				<p
					class="w-full px-4 text-c-on-bg/60 text-center leading-relaxed mb-4 {changeEmailStatus ===
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
						class="mt-4 md:mt-6 -mx-5 md:-mx-10 -mb-4 md:-mb-7 border-t-2 border-c-bg-secondary w-[calc(100%+1.5rem)] md:w-[calc(100%+5rem)]
						flex flex-col items-center justify-start relative z-0"
					>
						<DropdownItem onClick={() => (changeEmailStatus = 'idle')}>
							<div class="w-full flex items-center justify-center gap-2.5">
								<IconBack
									class="text-c-on-bg/60 w-6 h-6 transition not-touch:group-hover:text-c-primary"
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
						class="relative z-0 flex flex-col justify-start items-center w-full"
					>
						<form
							on:input={() => (errorText = null)}
							on:submit|preventDefault={changeEmail}
							class="w-full flex flex-col p-1 md:pb-2"
						>
							<Input
								disabled={changeEmailStatus === 'loading'}
								type="email"
								title={$LL.Account.ChangeEmail.NewEmailInput.Placeholder()}
								bind:value={email}
								hasIcon
							>
								<IconEmail slot="icon" class="w-full h-full" />
							</Input>
							{#if errorText}
								<ErrorLine text={errorText} class="text-xs -mt-1" />
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
			<div class="w-full flex items-center justify-center pt-3">
				<NoBgButton href="/account">
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
						/>
						<p class="transition text-c-on-bg/50 not-touch:group-hover:text-c-primary">
							{$LL.Shared.GoBackButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
		{/if}
	</div>
</PageWrapper>
