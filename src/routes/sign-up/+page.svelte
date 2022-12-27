<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconPassword from '$components/icons/IconPassword.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignUp } from '$ts/helpers/loggers';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { unconfirmedEmail } from '$ts/stores/unconfirmedEmail';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let email: string;
	let password: string;
	let otp: string;
	let signupStatus:
		| 'idle'
		| 'signup-loading'
		| 'signup-error'
		| 'otp'
		| 'otp-loading'
		| 'otp-error'
		| 'success' = 'idle';
	let errorText: string | null = null;
	const defaultRedirectRoute = '/pro';

	async function signup() {
		if (password.length < 8) {
			errorText = $LL.Error.PasswordTooShort();
			return;
		}
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		signupStatus = 'signup-loading';
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.log(error);
			signupStatus = 'signup-error';
			errorText = $LL.Error.SomethingWentWrong();
			return;
		} else {
			console.log(data);
			signupStatus = 'otp';
		}
	}

	async function confirm() {
		if (!supabase) return;
		signupStatus = 'otp-loading';
		const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
			email: email,
			token: String(otp),
			type: 'signup'
		});
		if (verifyError) {
			console.log(verifyError);
			signupStatus = 'otp-error';
			errorText = 'Wrong code, try again.';
			return;
		}
		mLogSignUp({
			'SC - Plan': $page.data.tier,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedMode,
			'SC - Page': $page.url.pathname
		});
		console.log(verifyData);
		setTimeout(() => {
			signupStatus = 'success';
		}, 200);
		await goto(data.redirect_to || defaultRedirectRoute);
	}

	onMount(() => {
		if ($unconfirmedEmail) {
			email = $unconfirmedEmail;
			signupStatus = 'otp';
		}
	});
</script>

<MetaTag
	title="Sign Up | Stablecog"
	description="Sign up to Stablecog and start generating beautiful images with Stable Diffusion."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if signupStatus === 'success'}
			<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
		{:else}
			<h1 class="text-center font-bold text-4xl">
				{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
					{$LL.SignUp.PageTitleConfirm()}
				{:else}
					{$LL.SignUp.PageTitle()}
				{/if}
			</h1>
			<div
				transition:expandCollapse|local={{ duration: 200 }}
				class="w-full flex flex-col items-center justify-start"
			>
				<p class="max-w-sm mt-4 text-c-on-bg/60 text-center leading-relaxed">
					{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
						{$LL.SignUp.PageParagraphConfirm()}
					{:else}
						{$LL.SignUp.PageParagraph()}
					{/if}
				</p>
				<form
					on:input={() => (errorText = null)}
					on:submit|preventDefault={signupStatus === 'otp' || signupStatus === 'otp-error'
						? confirm
						: signup}
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-6
          ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
						<div
							transition:expandCollapse|local={{ duration: 200 }}
							class="w-full flex flex-col justify-start"
						>
							<Input
								disabled={signupStatus === 'otp-loading'}
								type="number"
								title="6-Digit Code"
								bind:value={otp}
								hasIcon
							>
								<IconPassword slot="icon" class="w-full h-full" />
							</Input>
						</div>
					{:else}
						<div
							transition:expandCollapse|local={{ duration: 200 }}
							class="w-full flex flex-col justify-start"
						>
							<Input
								disabled={signupStatus === 'signup-loading'}
								type="email"
								title={$LL.Shared.EmailInput.Placeholder()}
								bind:value={email}
								hasIcon
							>
								<IconEmail slot="icon" class="w-full h-full" />
							</Input>
							<Input
								disabled={signupStatus === 'signup-loading'}
								type="password"
								title={$LL.Shared.PasswordInput.Placeholder()}
								bind:value={password}
								class="mt-2"
								hasIcon
							>
								<IconPassword slot="icon" class="w-full h-full" />
							</Input>
						</div>
					{/if}
					{#if errorText}
						<ErrorLine text={errorText} class="text-xs" />
					{/if}
					<Button
						class="mt-4"
						loading={signupStatus === 'signup-loading' || signupStatus === 'otp-loading'}
						withSpinner
					>
						{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
							{$LL.SignUp.ConfirmButton()}
						{:else}
							{$LL.SignUp.SignUpButton()}
						{/if}
					</Button>
				</form>
				<div class="w-full flex flex-col items-center justify-center mt-6">
					<p class="text-sm text-c-on-bg/50">{$LL.SignUp.AlreadyHaveAnAccountTitle()}</p>
					<NoBgButton prefetch target="_self" href="/sign-in" class="-mt-2 text-c-primary">
						{$LL.SignIn.SignInButton()}
					</NoBgButton>
				</div>
			</div>
		{/if}
	</div>
</PageWrapper>
