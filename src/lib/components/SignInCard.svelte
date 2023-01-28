<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import ButtonOAuth from '$components/buttons/ButtonOAuth.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import Input from '$components/Input.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { supabase } from '$ts/constants/supabase';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { Provider } from '@supabase/supabase-js';
	import { quadOut } from 'svelte/easing';

	export let redirectTo: string | null = null;
	export let isModal = false;

	let email: string;
	let signInStatus: 'idle' | 'loading' | 'error' | 'sent-otp' = 'idle';
	let provider: Provider | null | 'email' = null;
	let errorText: string | null = null;

	async function signIn() {
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		signInStatus = 'loading';
		provider = 'email';
		const { data: sData, error: sError } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${$page.url.origin}/api/auth/callback?redirect_to=${
					redirectTo ? encodeURIComponent(redirectTo) : ''
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

	async function signInWithOAuth(prov: Provider) {
		signInStatus = 'loading';
		provider = prov;
		const { data: sData, error: sError } = await supabase.auth.signInWithOAuth({
			provider: prov,
			options: {
				redirectTo: `${$page.url.origin}/api/auth/callback?redirect_to=${
					redirectTo ? encodeURIComponent(redirectTo) : ''
				}`
			}
		});
		if (sError) {
			console.log(sError);
			signInStatus = 'error';
			errorText = $LL.Error.SomethingWentWrong();
			return;
		}
		console.log(sData);
	}
</script>

<div
	class="max-w-full flex flex-col items-center justify-center bg-c-bg ring-c-bg-secondary ring-2 px-3 py-4 
	md:px-8 md:py-7 rounded-3xl {isModal
		? 'shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	{#if signInStatus === 'sent-otp'}
		<div class="mb-2">
			<IconEmail class="w-20 h-20 text-c-on-bg" />
		</div>
	{/if}
	<h1 class="max-w-sm text-center font-bold leading-normal mt-1 md:-mt-1 text-2xl px-8">
		{signInStatus === 'sent-otp'
			? $LL.SignIn.PageTitleSentLink()
			: $LL.SignIn.PageTitleGetStarted()}
	</h1>
	<div class="w-full flex flex-col items-center justify-start mt-1.5">
		<p
			class="px-3 md:px-0 max-w-sm text-sm md:text-base text-c-on-bg/60 text-center leading-relaxed mb-4 {signInStatus ===
			'sent-otp'
				? 'mt-1'
				: ''}"
		>
			{signInStatus === 'sent-otp'
				? $LL.SignIn.PageParagraphSentLink()
				: $LL.SignIn.PageParagraph()}
		</p>
		{#if signInStatus === 'sent-otp'}
			<div
				transition:expandCollapse|local={{ duration: 200, easing: quadOut, opacity: 0 }}
				class="w-full flex flex-col items-center justify-start relative z-0"
			>
				<div class="w-full p-1 flex items-center justify-center -mt-1 -mb-2 md:-mb-4">
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
				class="relative z-0 flex flex-col justify-start items-center w-full"
			>
				<div class="w-full flex flex-col items-center justify-start p-1 mt-1 md:mt-2 max-w-[21rem]">
					<div class="w-full flex flex-col items-center justify-start gap-3">
						<ButtonOAuth
							withSpinner
							disabled={signInStatus === 'loading'}
							loading={signInStatus === 'loading' && provider === 'google'}
							class="w-full"
							onClick={() => signInWithOAuth('google')}
							provider="google"
						>
							{$LL.SignIn.ContinueWithProviderButton({ provider: 'Google' })}
						</ButtonOAuth>
						<ButtonOAuth
							withSpinner
							disabled={signInStatus === 'loading'}
							loading={signInStatus === 'loading' && provider === 'discord'}
							class="w-full"
							onClick={() => signInWithOAuth('discord')}
							provider="discord"
						>
							<p class="w-full">{$LL.SignIn.ContinueWithProviderButton({ provider: 'Discord' })}</p>
						</ButtonOAuth>
					</div>
				</div>
				<div
					class="flex items-center gap-4 my-5 md:my-6 -mx-5 md:-mx-10 w-[calc(100%+2.5rem)] md:w-[calc(100%+5rem)]"
				>
					<div class="flex-1 h-2px rounded-r-full bg-c-bg-secondary" />
					<p class="text-sm text-c-on-bg/50 text-center inline-block">
						{$LL.SignIn.OrContinueWithEmailTitle()}
					</p>
					<div class="flex-1 h-2px rounded-l-full bg-c-bg-secondary" />
				</div>
				<form
					on:input={() => (errorText = null)}
					on:submit|preventDefault={signIn}
					class="w-full flex flex-col p-1 md:pb-2 max-w-[21rem]"
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
					<Button
						class="mt-4"
						disabled={signInStatus === 'loading'}
						loading={signInStatus === 'loading' && provider == 'email'}
						withSpinner
					>
						{$LL.SignIn.ContinueButton()}
					</Button>
				</form>
			</div>
		{/if}
	</div>
</div>
