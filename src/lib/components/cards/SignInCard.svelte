<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ButtonOAuth from '$components/primitives/buttons/ButtonOAuth.svelte';
	import DropdownItem from '$components/primitives/dropdown/DropdownItem.svelte';
	import ErrorLine from '$components/error/ErrorLine.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import Input from '$components/primitives/Input.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import type { Provider } from '@supabase/supabase-js';
	import { quadOut } from 'svelte/easing';
	import IconPassword from '$components/icons/IconPassword.svelte';
	import { wantsEmail } from '$ts/stores/user/wantsEmail';
	import { onDestroy, onMount } from 'svelte';
	import WantsEmailCard from '$components/cards/WantsEmailCard.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { signInCardCodeSignInStatus, signInCardStatus } from '$ts/stores/signInCardState';
	import { apiUrl } from '$ts/constants/main';
	import PinInput from '$components/primitives/PinInput.svelte';
	import { sessionStore, supabaseStore } from '$ts/constants/supabase';

	export let redirectTo: string | null = null;
	export let isModal = false;
	export let title: string | undefined = undefined;
	export let paragraph: string | undefined = undefined;

	let email: string;
	let provider: Provider | null | 'email' = null;
	let errorText: string | null = null;
	let codeValue: string;
	let codeSignInErrorText: string | null = null;
	const codeLength = 6;

	let wantsEmailChecked = false;
	let wantsEmailOnMount = false;

	$: isCodeValid = codeValue?.length === codeLength;

	async function signIn() {
		if (!$supabaseStore) return;
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		if (wantsEmailChecked) {
			wantsEmail.set(true);
		}
		signInCardStatus.set('loading');
		provider = 'email';
		const res = await fetch(`${apiUrl.origin}/v1/email/check`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email
			})
		});
		const resJSON: { allowed: boolean } = await res.json();
		if (!resJSON.allowed) {
			signInCardStatus.set('error');
			errorText = $LL.Error.EmailNotAllowed();
			return;
		}
		const { data: sData, error: sError } = await $supabaseStore.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${$page.url.origin}/auth/callback?rd_to=${
					redirectTo ? encodeURIComponent(redirectTo) : ''
				}`
			}
		});
		if (sError) {
			console.log(sError);
			signInCardStatus.set('error');
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
		signInCardStatus.set('sent-otp');
	}

	async function signInWithOAuth(prov: Provider) {
		if (!$supabaseStore) return;
		if (wantsEmailChecked) {
			wantsEmail.set(true);
		}
		signInCardStatus.set('loading');
		provider = prov;
		const { data: sData, error: sError } = await $supabaseStore.auth.signInWithOAuth({
			provider: prov,
			options: {
				redirectTo: `${$page.url.origin}/auth/callback?rd_to=${
					redirectTo ? encodeURIComponent(redirectTo) : ''
				}`
			}
		});
		if (sError) {
			console.log(sError);
			signInCardStatus.set('error');
			errorText = $LL.Error.InvalidCode();
			return;
		}
		console.log(sData);
	}

	const docRoutes = [
		{
			route: '/',
			strictMatch: true
		},
		{
			route: '/docs'
		},
		{
			route: '/blog'
		},
		{
			route: '/try'
		},
		{
			route: '/guide'
		}
	];

	async function signInWithCode() {
		if (!$supabaseStore) return;
		if (!isCodeValid) return;
		signInCardCodeSignInStatus.set('loading');
		try {
			const { data: sData, error: sError } = await $supabaseStore.auth.verifyOtp({
				email,
				token: codeValue.toString(),
				type: 'email'
			});
			if (sError) {
				throw new Error(sError.message);
			}
			console.log(sData);
			if (
				sData.session?.access_token &&
				docRoutes.some((r) =>
					r.strictMatch === true
						? $page.url.pathname === r.route
						: $page.url.pathname.startsWith(r.route)
				)
			) {
				const us = await getUserSummary(sData.session?.access_token);
				userSummary.set(us);
			}
		} catch (error) {
			console.log(error);
			signInCardCodeSignInStatus.set('error');
			codeSignInErrorText = $LL.Error.SomethingWentWrong();
		}
	}

	onMount(() => {
		if ($wantsEmail === true) {
			wantsEmailOnMount = true;
		}
	});

	onDestroy(() => {
		if ($sessionStore?.user.id && $userSummary) {
			signInCardStatus.set('idle');
			signInCardCodeSignInStatus.set('idle');
		}
	});
</script>

<div
	class="max-w-full flex flex-col items-center justify-center bg-c-bg ring-c-bg-secondary ring-2 px-3 py-4
	md:px-10 md:py-7 rounded-3xl relative z-10 overflow-hidden {isModal
		? 'shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	{#if $signInCardStatus === 'sent-otp'}
		<div
			transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
			class="flex flex-col justify-start"
		>
			<div class="pb-2">
				<IconEmail class="w-20 h-20 text-c-on-bg" />
			</div>
		</div>
	{/if}
	<h1 class="max-w-sm text-center font-bold leading-normal mt-1 md:-mt-1 text-2xl px-8">
		{$signInCardStatus === 'sent-otp'
			? $LL.SignIn.PageTitleSentLink()
			: title
			? title
			: $LL.SignIn.PageTitleGetStarted()}
	</h1>
	<div class="w-full flex flex-col items-center justify-start mt-1.5">
		<p
			class="px-3 md:px-0 max-w-sm text-base md:text-base text-c-on-bg/75 text-center leading-relaxed mb-4 {$signInCardStatus ===
			'sent-otp'
				? 'mt-1'
				: ''}"
		>
			{$signInCardStatus === 'sent-otp'
				? $LL.SignIn.PageParagraphSentLink()
				: paragraph
				? paragraph
				: $LL.SignIn.PageParagraphV2()}
		</p>
		{#if !wantsEmailOnMount && $signInCardStatus !== 'sent-otp'}
			<WantsEmailCard bind:checked={wantsEmailChecked} class="mb-3.5 max-w-[20.5rem]" />
		{/if}
		{#if $signInCardStatus === 'sent-otp'}
			<div
				transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
				class="w-[calc(100%+1.5rem)] md:w-[calc(100%+5rem)] -mx-5 md:-mx-10 pt-4 md:pt-6 -mb-4 md:-mb-7 flex flex-col justify-start"
			>
				<div class="w-full flex flex-col justify-start items-center">
					<div
						class="w-full border-t-2 border-c-bg-secondary flex flex-col justify-start items-center relative z-0"
					>
						{#if $signInCardCodeSignInStatus === 'idle'}
							<div
								transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
								class="w-full"
							>
								<DropdownItem onClick={() => ($signInCardCodeSignInStatus = 'entering')}>
									<div class="w-full flex items-center justify-center gap-2.5">
										<IconPassword
											class="text-c-on-bg/75 w-6 h-6 transition not-touch:group-hover:text-c-primary"
										/>
										<p class="text-c-on-bg/75 transition not-touch:group-hover:text-c-primary">
											{$LL.SignIn.EnterCodeManuallyButton()}
										</p>
									</div>
								</DropdownItem>
							</div>
						{:else}
							<form
								transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
								on:submit|preventDefault={signInWithCode}
								class="w-full flex flex-col justify-start items-center"
							>
								<div
									class="flex flex-col justify-start items-center px-4 pt-5 pb-6 md:px-6 md:pt-6 md:pb-7"
								>
									<div class="w-full flex flex-col justify-start items-center max-w-[21rem]">
										<PinInput
											bind:value={codeValue}
											on:pincomplete={signInWithCode}
											onInput={() => {
												codeSignInErrorText = null;
											}}
										/>
										<Button
											disabled={!isCodeValid}
											withSpinner
											loading={$signInCardCodeSignInStatus === 'loading'}
											class="mt-4 w-full">{$LL.SignIn.ContinueButton()}</Button
										>
										{#if codeSignInErrorText}
											<ErrorLine text={codeSignInErrorText} class="text-xs w-full" />
										{/if}
									</div>
								</div>
							</form>
						{/if}
						<div class="w-full h-2px bg-c-bg-secondary" />
						<DropdownItem
							onClick={() => {
								signInCardStatus.set('idle');
								signInCardCodeSignInStatus.set('idle');
								codeSignInErrorText = null;
							}}
						>
							<div class="w-full flex items-center justify-center gap-2.5">
								<IconBack
									class="text-c-on-bg/75 w-6 h-6 transition not-touch:group-hover:text-c-primary"
								/>
								<p class="text-c-on-bg/75 transition not-touch:group-hover:text-c-primary">
									{$LL.Shared.GoBackButton()}
								</p>
							</div>
						</DropdownItem>
					</div>
				</div>
			</div>
		{:else}
			<div
				transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
				class="relative z-0 flex flex-col justify-start items-center w-full"
			>
				<div class="w-full flex flex-col items-center justify-start p-1 mt-1 md:mt-2 max-w-[21rem]">
					<div class="w-full flex flex-col items-center justify-start gap-3">
						<ButtonOAuth
							withSpinner
							disabled={$signInCardStatus === 'loading'}
							loading={$signInCardStatus === 'loading' && provider === 'google'}
							class="w-full"
							onClick={() => signInWithOAuth('google')}
							provider="google"
						>
							{$LL.SignIn.ContinueWithProviderButton({ provider: 'Google' })}
						</ButtonOAuth>
						<ButtonOAuth
							withSpinner
							disabled={$signInCardStatus === 'loading'}
							loading={$signInCardStatus === 'loading' && provider === 'discord'}
							class="w-full"
							onClick={() => signInWithOAuth('discord')}
							provider="discord"
						>
							<p class="w-full">{$LL.SignIn.ContinueWithProviderButton({ provider: 'Discord' })}</p>
						</ButtonOAuth>
					</div>
				</div>
				<div
					class="flex items-center gap-4 my-5 md:my-6 -mx-5 md:-mx-10 w-[calc(100%+1.5rem)] md:w-[calc(100%+5rem)]"
				>
					<div class="flex-1 h-2px rounded-r-full bg-c-bg-secondary" />
					<p class="text-base text-c-on-bg/50 text-center inline-block">
						{$LL.SignIn.OrContinueWithEmailTitle()}
					</p>
					<div class="flex-1 h-2px rounded-l-full bg-c-bg-secondary" />
				</div>
				<form
					on:input={() => (errorText = null)}
					on:submit|preventDefault={signIn}
					class="w-full flex flex-col p-1 md:pb-2 max-w-[21rem]"
				>
					<Input
						disabled={$signInCardStatus === 'loading'}
						type="email"
						title={$LL.Shared.EmailInput.Placeholder()}
						bind:value={email}
						enterkeyhint="go"
						hasIcon
					>
						<IconEmail slot="icon" class="w-full h-full" />
					</Input>
					{#if errorText}
						<ErrorLine text={errorText} class="text-xs -mt-1" />
					{/if}
					<Button
						class="mt-3"
						disabled={$signInCardStatus === 'loading'}
						loading={$signInCardStatus === 'loading' && provider == 'email'}
						withSpinner
					>
						{$LL.SignIn.ContinueButton()}
					</Button>
				</form>
			</div>
		{/if}
	</div>
</div>
