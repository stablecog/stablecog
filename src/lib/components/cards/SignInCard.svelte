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
	import { writable } from 'svelte/store';

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

	let wantsEmailChecked = writable(false);
	let wantsEmailOnMount = false;

	$: isCodeValid = codeValue?.length === codeLength;

	async function signIn() {
		if (!$supabaseStore) return;
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
			return;
		}
		if ($wantsEmailChecked) {
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
				emailRedirectTo: redirectTo ? encodeURIComponent(redirectTo) : '/'
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
		if ($wantsEmailChecked) {
			wantsEmail.set(true);
		}
		signInCardStatus.set('loading');
		provider = prov;
		const { data: sData, error: sError } = await $supabaseStore.auth.signInWithOAuth({
			provider: prov,
			options: {
				redirectTo: `${$page.url.origin}/auth/callback?rd_to=${
					redirectTo ? encodeURIComponent(redirectTo) : '/'
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
	class="relative z-10 flex max-w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-c-bg
	px-3 py-4 ring-2 ring-c-bg-secondary md:px-10 md:py-7 {isModal
		? 'shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)]'
		: 'shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]'}"
>
	{#if $signInCardStatus === 'sent-otp'}
		<div
			transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
			class="flex flex-col justify-start"
		>
			<div class="pb-2">
				<IconEmail class="h-20 w-20 text-c-on-bg" />
			</div>
		</div>
	{/if}
	<h1 class="mt-1 max-w-sm px-8 text-center text-2xl font-bold leading-normal md:-mt-1">
		{$signInCardStatus === 'sent-otp'
			? $LL.SignIn.PageTitleSentLink()
			: title
				? title
				: $LL.SignIn.PageTitleGetStarted()}
	</h1>
	<div class="mt-1.5 flex w-full flex-col items-center justify-start">
		<p
			class="mb-4 max-w-sm px-3 text-center text-base leading-relaxed text-c-on-bg/75 md:px-0 md:text-base {$signInCardStatus ===
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
			<WantsEmailCard checked={wantsEmailChecked} class="mb-3.5 max-w-[20.5rem]" />
		{/if}
		{#if $signInCardStatus === 'sent-otp'}
			<div
				transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
				class="-mx-5 -mb-4 flex w-[calc(100%+1.5rem)] flex-col justify-start pt-4 md:-mx-10 md:-mb-7 md:w-[calc(100%+5rem)] md:pt-6"
			>
				<div class="flex w-full flex-col items-center justify-start">
					<div
						class="relative z-0 flex w-full flex-col items-center justify-start border-t-2 border-c-bg-secondary"
					>
						{#if $signInCardCodeSignInStatus === 'idle'}
							<div
								transition:expandCollapse={{ duration: 200, easing: quadOut, opacity: 0 }}
								class="w-full"
							>
								<DropdownItem
									padding="md"
									noHoverEffectPadding
									onClick={() => ($signInCardCodeSignInStatus = 'entering')}
								>
									<div class="flex w-full items-center justify-center gap-2.5">
										<IconPassword
											class="h-6 w-6 text-c-on-bg/75 transition not-touch:group-hover:text-c-primary"
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
								class="flex w-full flex-col items-center justify-start"
							>
								<div
									class="flex flex-col items-center justify-start px-4 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6"
								>
									<div class="flex w-full max-w-[21rem] flex-col items-center justify-start">
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
											<ErrorLine text={codeSignInErrorText} class="w-full text-xs" />
										{/if}
									</div>
								</div>
							</form>
						{/if}
						<div class="h-2px w-full bg-c-bg-secondary" />
						<DropdownItem
							padding="md"
							noHoverEffectPadding
							onClick={() => {
								signInCardStatus.set('idle');
								signInCardCodeSignInStatus.set('idle');
								codeSignInErrorText = null;
							}}
						>
							<div class="flex w-full items-center justify-center gap-2.5">
								<IconBack
									class="h-6 w-6 text-c-on-bg/75 transition not-touch:group-hover:text-c-primary"
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
				class="relative z-0 flex w-full flex-col items-center justify-start"
			>
				<div class="mt-1 flex w-full max-w-[21rem] flex-col items-center justify-start p-1 md:mt-2">
					<div class="flex w-full flex-col items-center justify-start gap-3">
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
							<p class="min-w-0 flex-1">
								{$LL.SignIn.ContinueWithProviderButton({ provider: 'Discord' })}
							</p>
						</ButtonOAuth>
					</div>
				</div>
				<div
					class="-mx-5 my-5 flex w-[calc(100%+1.5rem)] items-center gap-4 md:-mx-10 md:my-6 md:w-[calc(100%+5rem)]"
				>
					<div class="h-2px flex-1 rounded-r-full bg-c-bg-secondary" />
					<p class="inline-block min-w-0 flex-shrink text-center text-base text-c-on-bg/60">
						{$LL.SignIn.OrContinueWithEmailTitle()}
					</p>
					<div class="h-2px flex-1 rounded-l-full bg-c-bg-secondary" />
				</div>
				<form
					on:input={() => (errorText = null)}
					on:submit|preventDefault={signIn}
					class="flex w-full max-w-[21rem] flex-col px-1 pb-3.5 pt-1"
				>
					<Input
						class="w-full"
						disabled={$signInCardStatus === 'loading'}
						type="email"
						title={$LL.Shared.EmailInput.Placeholder()}
						bind:value={email}
						enterkeyhint="go"
						hasIcon
					>
						<IconEmail slot="icon" class="h-full w-full" />
					</Input>
					{#if errorText}
						<ErrorLine text={errorText} class="-mt-1 text-xs" />
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
			<div
				class="-mx-5 my-5 flex h-2px w-[calc(100%+1.5rem)] items-center gap-4 bg-c-bg-secondary
				md:-mx-10 md:my-6 md:w-[calc(100%+5rem)]"
			/>
			<div class="-mt-1.5 flex w-full justify-center px-2 md:-mb-2 md:-mt-2 md:px-0">
				<p class="max-w-xs text-sm text-c-on-bg/60">
					{@html $LL.Legal.SignUpPoliciesConfirmationPagraph({
						termsOfService: `<a target='_blank' class='text-c-primary hover:underline' href="/terms">${$LL.Legal.TermsOfServiceTitle()}</a>`,
						privacyPolicy: `<a target="_blank" class='text-c-primary hover:underline' href="/privacy">${$LL.Legal.PrivacyPolicyTitle()}</a>`
					})}
				</p>
			</div>
		{/if}
	</div>
</div>
