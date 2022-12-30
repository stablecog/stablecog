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
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignIn } from '$ts/helpers/loggers';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { unconfirmedEmail } from '$ts/stores/unconfirmedEmail';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let email: string;
	let password: string;
	let signInStatus: 'idle' | 'loading' | 'error' | 'success' = 'idle';
	let errorText: string | null = null;
	const defaultRedirectRoute = '/';

	async function signIn() {
		if (password.length < 8) {
			errorText = $LL.Error.PasswordTooShort();
			return;
		}
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		signInStatus = 'loading';
		const { data: sData, error: sError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (sError) {
			console.log(sError);
			signInStatus = 'error';
			if (sError.message === 'Invalid login credentials') {
				errorText = $LL.Error.InvalidCredentials();
			} else if (sError.message === 'Email not confirmed') {
				unconfirmedEmail.set(email);
				await goto('/sign-up', { state: { email } });
			} else {
				errorText = $LL.Error.SomethingWentWrong();
			}
			return;
		}
		console.log(sData);
		mLogSignIn({
			'SC - Plan': $page.data.tier,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedMode,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`
		});
		setTimeout(() => {
			signInStatus = 'success';
		}, 200);
		await goto(data.redirect_to || defaultRedirectRoute);
	}
</script>

<MetaTag
	title="Sign In | Stablecog"
	description="Sign in to Stablecog and use it with all features that are available to your account."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if signInStatus === 'success'}
			<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
		{:else}
			<h1 class="text-center font-bold text-4xl">{$LL.SignIn.PageTitle()}</h1>
			<div class="w-full flex flex-col items-center justify-start mt-4">
				<p class="max-w-sm text-c-on-bg/60 text-center leading-relaxed">
					{$LL.SignIn.PageParagraph()}
				</p>
				<div
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-6
					ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<form
						on:input={() => (errorText = null)}
						on:submit|preventDefault={signIn}
						class="w-full flex flex-col"
					>
						<div class="w-full flex flex-col justify-start">
							<Input
								disabled={signInStatus === 'loading'}
								type="email"
								title={$LL.Shared.EmailInput.Placeholder()}
								bind:value={email}
								hasIcon
							>
								<IconEmail slot="icon" class="w-full h-full" />
							</Input>
							<Input
								disabled={signInStatus === 'loading'}
								type="password"
								title={$LL.Shared.PasswordInput.Placeholder()}
								bind:value={password}
								class="mt-2"
								hasIcon
							>
								<IconPassword slot="icon" class="w-full h-full" />
							</Input>
						</div>
						{#if errorText}
							<ErrorLine text={errorText} class="text-xs" />
						{/if}
						<Button class="mt-4" loading={signInStatus === 'loading'} withSpinner>
							{$LL.SignIn.SignInButton()}
						</Button>
					</form>
					{#if errorText !== null}
						<div class="w-full flex items-center justify-center pt-2 -mb-4">
							<NoBgButton prefetch target="_self" href="/forgot-password" type="sm">
								{$LL.ForgotPassword.ForgotPasswordButton()}
							</NoBgButton>
						</div>
					{/if}
				</div>
				<div class="w-full flex flex-col items-center justify-center mt-6">
					<p class="text-sm text-c-on-bg/50">{$LL.SignIn.DontHaveAnAccountTitle()}</p>
					<NoBgButton prefetch target="_self" href="/sign-up" class="-mt-2 text-c-primary">
						{$LL.SignUp.SignUpButton()}
					</NoBgButton>
				</div>
			</div>
		{/if}
	</div>
</PageWrapper>
