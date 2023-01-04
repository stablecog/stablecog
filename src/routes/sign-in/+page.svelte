<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignIn } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { quadOut } from 'svelte/easing';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let email: string;
	let signInStatus: 'idle' | 'loading' | 'error' | 'sent-otp' = 'idle';
	let errorText: string | null = null;

	$: $page.data.session?.user.id, redirect();

	async function redirect() {
		if (!browser) return;
		if (!$page.data.session?.user.id) return;
		await goto('/');
	}

	async function signIn() {
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		signInStatus = 'loading';
		const { data: sData, error: sError } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${$page.url.origin}/api/auth/callback?redirect_to=${
					data.redirect_to ? encodeURIComponent(data.redirect_to) : ''
				}`
			}
		});
		if (sError) {
			console.log(sError);
			signInStatus = 'error';
			if (
				sError.message === 'For security purposes, you can only request this once every 60 seconds'
			) {
				errorText = $LL.Error.OnceEvery60Seconds();
			} else {
				errorText = $LL.Error.SomethingWentWrong();
			}
			return;
		}
		console.log(sData);
		signInStatus = 'sent-otp';
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
		{#if signInStatus === 'sent-otp'}
			<div class="mb-2">
				<IconEmail class="w-20 h-20 text-c-on-bg" />
			</div>
		{/if}
		<h1 class="text-center font-bold max-w-lg leading-tight text-3xl">
			{signInStatus === 'sent-otp'
				? $LL.SignIn.PageTitleSentLink()
				: $LL.SignIn.PageTitleCreateAccountOrSignIn()}
		</h1>
		<div class="w-full flex flex-col items-center justify-start mt-3">
			<p class="max-w-lg text-c-on-bg/60 text-center leading-relaxed mb-6">
				{signInStatus === 'sent-otp'
					? $LL.SignIn.PageParagraphSentLink()
					: $LL.SignIn.PageParagraph()}
			</p>
			{#if signInStatus === 'sent-otp'}
				<div
					transition:expandCollapse|local={{ duration: 200, easing: quadOut, opacity: 0 }}
					class="w-full flex flex-col items-center justify-start overflow-hidden relative z-0"
				>
					<div class="w-full p-1 flex items-center justify-center">
						<NoBgButton onClick={() => (signInStatus = 'idle')}>
							<div class="flex items-center justify-center gap-2.5 px-2 py-1">
								<IconBack
									class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
									{!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
								/>
								<p class="font-bold">{$LL.Shared.GoBackButton()}</p>
							</div>
						</NoBgButton>
					</div>
				</div>
			{:else}
				<div
					transition:expandCollapse|local={{ duration: 200, easing: quadOut, opacity: 0 }}
					class="w-full bg-c-bg-secondary max-w-sm overflow-hidden relative z-0 flex flex-col justify-start rounded-3xl
					ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<form
						on:input={() => (errorText = null)}
						on:submit|preventDefault={signIn}
						class="w-full flex flex-col p-4 md:p-5"
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
						</div>
						{#if errorText}
							<ErrorLine text={errorText} class="text-xs" />
						{/if}
						<Button class="mt-4" loading={signInStatus === 'loading'} withSpinner>
							{$LL.SignIn.ContinueButton()}
						</Button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</PageWrapper>
