<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconPassword from '$components/icons/IconPassword.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	let email: string;
	let otpCode: string;
	let password: string;
	let resetProcessStatus: TResetPasswordStatus = 'idle';
	let errorText: string | null = null;

	type TResetPasswordStatus =
		| 'idle'
		| 'reset-email-send-loading'
		| 'reset-email-send-error'
		| 'reset-email-send-success'
		| 'confirm-code-loading'
		| 'confirm-code-error'
		| 'confirm-code-success'
		| 'new-password-loading'
		| 'new-password-error'
		| 'success';

	async function sendResetCode() {
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		resetProcessStatus = 'reset-email-send-loading';
		const { data: resetEmailData, error: resetEmailError } =
			await supabase.auth.resetPasswordForEmail(email);
		if (resetEmailError) {
			console.log(resetEmailError);
			resetProcessStatus = 'reset-email-send-error';
			errorText = $LL.Error.SomethingWentWrong();
			return;
		}
		console.log(resetEmailData);
		resetProcessStatus = 'reset-email-send-success';
	}

	async function confirmOtp() {
		resetProcessStatus = 'confirm-code-loading';
		const { data: confirmCodeData, error: confirmCodeError } = await supabase.auth.verifyOtp({
			email,
			type: 'recovery',
			token: String(otpCode)
		});
		if (confirmCodeError) {
			console.log(confirmCodeError);
			resetProcessStatus = 'confirm-code-error';
			errorText = $LL.Error.SomethingWentWrong();
			return;
		}
		console.log(confirmCodeData);
		resetProcessStatus = 'confirm-code-success';
	}

	async function setNewPassword() {
		resetProcessStatus = 'new-password-loading';
		const { data: newPasswordData, error: newPasswordError } = await supabase.auth.updateUser({
			password
		});
		if (newPasswordError) {
			console.log(newPasswordError);
			resetProcessStatus = 'new-password-error';
			errorText = $LL.Error.SomethingWentWrong();
			return;
		}
		console.log(newPasswordData);
		resetProcessStatus = 'success';
	}

	$: [title, paragraph, buttonText] = getTitleAndParagraph(resetProcessStatus);

	function getTitleAndParagraph(resetProcessStatus: TResetPasswordStatus) {
		switch (resetProcessStatus) {
			case 'idle':
				return [
					$LL.ForgotPassword.PageTitle(),
					$LL.ForgotPassword.PageParagraph(),
					$LL.ForgotPassword.SendResetCodeButton()
				];
			case 'reset-email-send-loading':
				return [
					$LL.ForgotPassword.PageTitle(),
					$LL.ForgotPassword.PageParagraph(),
					$LL.ForgotPassword.SendResetCodeButton()
				];
			case 'reset-email-send-error':
				return [
					$LL.ForgotPassword.PageTitle(),
					$LL.ForgotPassword.PageParagraph(),
					$LL.ForgotPassword.SendResetCodeButton()
				];
			case 'reset-email-send-success':
				return [
					$LL.ForgotPassword.PageTitleConfirmCodeAlt(),
					$LL.ForgotPassword.PageParagraphConfirmCode(),
					$LL.ForgotPassword.ConfirmCodeButton()
				];
			case 'confirm-code-loading':
				return [
					$LL.ForgotPassword.PageTitleConfirmCodeAlt(),
					$LL.ForgotPassword.PageParagraphConfirmCode(),
					$LL.ForgotPassword.ConfirmCodeButton()
				];
			case 'confirm-code-error':
				return [
					$LL.ForgotPassword.PageTitleConfirmCodeAlt(),
					$LL.ForgotPassword.PageParagraphConfirmCode(),
					$LL.ForgotPassword.ConfirmCodeButton()
				];
			case 'confirm-code-success':
				return [
					$LL.ForgotPassword.PageTitleNewPassword(),
					$LL.ForgotPassword.PageParagraphNewPassword(),
					$LL.ForgotPassword.SetNewPasswordButton()
				];
			case 'new-password-loading':
				return [
					$LL.ForgotPassword.PageTitleNewPassword(),
					$LL.ForgotPassword.PageParagraphNewPassword(),
					$LL.ForgotPassword.SetNewPasswordButton()
				];
			case 'new-password-error':
				return [
					$LL.ForgotPassword.PageTitleNewPassword(),
					$LL.ForgotPassword.PageParagraphNewPassword(),
					$LL.ForgotPassword.SetNewPasswordButton()
				];
			case 'success':
				return [
					$LL.ForgotPassword.PageTitleSuccess(),
					$LL.ForgotPassword.PageParagraphSuccess(),
					$LL.ForgotPassword.SetNewPasswordButton()
				];
			default:
				return [
					$LL.ForgotPassword.PageTitle(),
					$LL.ForgotPassword.PageParagraph(),
					$LL.ForgotPassword.SendResetCodeButton()
				];
		}
	}
</script>

<MetaTag
	title="Forgot Password | Stablecog"
	description="Reset your password and login to Stablecog to use it with all features that are available to your account."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if resetProcessStatus === 'success'}
			<div
				transition:scale|local={{ duration: 200, easing: quadOut, start: 0, opacity: 0.5 }}
				class="pb-4"
			>
				<IconTick class="w-24 h-24 text-c-primary" />
			</div>
		{/if}
		{#if resetProcessStatus === 'reset-email-send-success' || resetProcessStatus === 'confirm-code-loading' || resetProcessStatus === 'confirm-code-error'}
			<div transition:scale|local={{ duration: 200, easing: quadOut, opacity: 0 }} class="mb-2">
				<IconEmail class="w-20 h-20 text-c-on-bg" />
			</div>
		{/if}
		<h1
			class="text-center font-bold text-4xl transition {resetProcessStatus === 'success'
				? 'text-c-primary'
				: 'text-c-on-bg'}"
		>
			{title}
		</h1>
		<div class="w-full flex flex-col items-center justify-start mt-4">
			<p
				class="{resetProcessStatus === 'success'
					? 'max-w-md'
					: 'max-w-sm'} text-c-on-bg/60 leading-relaxed text-center"
			>
				{paragraph}
			</p>
			{#if resetProcessStatus !== 'success'}
				<form
					on:input={() => (errorText = null)}
					on:submit|preventDefault={resetProcessStatus === 'idle' ||
					resetProcessStatus === 'reset-email-send-loading' ||
					resetProcessStatus === 'reset-email-send-error'
						? sendResetCode
						: resetProcessStatus === 'reset-email-send-success' ||
						  resetProcessStatus === 'confirm-code-loading' ||
						  resetProcessStatus === 'confirm-code-error'
						? confirmOtp
						: setNewPassword}
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-6
				ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<div class="w-full flex flex-col justify-start">
						{#if resetProcessStatus === 'idle' || resetProcessStatus === 'reset-email-send-loading' || resetProcessStatus === 'reset-email-send-error'}
							<Input
								disabled={resetProcessStatus === 'reset-email-send-loading'}
								type="email"
								title={$LL.Shared.EmailInput.Placeholder()}
								bind:value={email}
								hasIcon
							>
								<IconEmail slot="icon" class="w-full h-full" />
							</Input>
						{:else if resetProcessStatus === 'reset-email-send-success' || resetProcessStatus === 'confirm-code-loading' || resetProcessStatus === 'confirm-code-error'}
							<Input
								disabled={resetProcessStatus === 'confirm-code-loading'}
								type="number"
								title={$LL.SignUp.SixDigitCodeInput.Placeholder()}
								bind:value={otpCode}
								hasIcon
							>
								<IconPassword slot="icon" class="w-full h-full" />
							</Input>
						{:else if resetProcessStatus === 'confirm-code-success' || resetProcessStatus === 'new-password-loading' || resetProcessStatus === 'new-password-error'}
							<Input
								disabled={resetProcessStatus === 'new-password-loading'}
								type="password"
								title={$LL.ForgotPassword.NewPasswordInput.Placeholder()}
								bind:value={password}
								hasIcon
							>
								<IconPassword slot="icon" class="w-full h-full" />
							</Input>
						{/if}
					</div>
					{#if errorText}
						<ErrorLine text={errorText} class="text-xs" />
					{/if}
					<Button
						class="mt-4"
						loading={resetProcessStatus === 'reset-email-send-loading' ||
							resetProcessStatus === 'confirm-code-loading' ||
							resetProcessStatus === 'new-password-loading'}
						withSpinner
					>
						{buttonText}
					</Button>
				</form>
				{#if resetProcessStatus === 'idle' || resetProcessStatus === 'reset-email-send-loading' || resetProcessStatus === 'reset-email-send-error'}
					<div class="w-full flex flex-col items-center justify-center mt-6">
						<p class="text-sm text-c-on-bg/50">{$LL.SignUp.AlreadyHaveAnAccountTitle()}</p>
						<NoBgButton prefetch target="_self" href="/sign-in" class="-mt-2 text-c-primary">
							{$LL.SignIn.SignInButton()}
						</NoBgButton>
					</div>
				{/if}
			{:else}
				<Button href="/" class="mt-6">{$LL.Shared.GoHomeButton()}</Button>
			{/if}
		</div>
	</div>
</PageWrapper>
