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
	let errorText: string | null = null;

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

	async function signInWithOAuth(provider: Provider) {
		signInStatus = 'loading';
		const { data: sData, error: sError } = await supabase.auth.signInWithOAuth({
			provider,
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
	class="max-w-full flex flex-col items-center justify-center bg-c-bg ring-c-bg-secondary ring-2 p-5 
	md:px-10 md:py-7 rounded-3xl {isModal
		? 'shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	{#if signInStatus === 'sent-otp'}
		<div class="mb-2">
			<IconEmail class="w-20 h-20 text-c-on-bg" />
		</div>
	{/if}
	<h1 class="text-center font-bold max-w-lg leading-tight text-xl md:text-2xl mt-1 px-4">
		{signInStatus === 'sent-otp'
			? $LL.SignIn.PageTitleSentLink()
			: $LL.SignIn.PageTitleCreateAccountOrSignIn()}
	</h1>
	<div class="w-full flex flex-col items-center justify-start mt-2">
		<p class="max-w-sm text-c-on-bg/60 text-center leading-relaxed mb-4">
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
				<div class="w-full flex flex-col items-center justify-start p-1 md:pb-2 max-w-xs">
					<div class="w-full flex flex-col items-center justify-start">
						<ButtonOAuth
							withSpinner
							loading={signInStatus === 'loading'}
							class="w-full"
							onClick={() => signInWithOAuth('google')}
							provider={'google'}
						>
							{$LL.SignIn.ContinueWithProviderButton({ provider: 'Google' })}
						</ButtonOAuth>
					</div>
				</div>
				<div
					class="flex items-center gap-4 mt-4 -mx-5 md:-mx-10 w-[calc(100%+2.5rem)] md:w-[calc(100%+5rem)]"
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
					class="w-full flex flex-col max-w-xs p-1 md:pb-2 mt-4 md:mt-5"
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
