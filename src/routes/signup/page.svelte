<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import Input from '$components/Input.svelte';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { supabase } from '$ts/constants/supabase';
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
		}
		console.log(data);
		signupStatus = 'otp';
	}

	async function confirm() {
		if (!supabase) return;
		signupStatus = 'otp-loading';
		const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
			email: email,
			token: otp,
			type: 'signup'
		});
		if (verifyError) {
			console.log(verifyError);
			signupStatus = 'otp-error';
			errorText = 'Wrong code, try again.';
			return;
		}
		console.log(verifyData);
		signupStatus = 'success';
		await goto(data.redirect_to || defaultRedirectRoute);
	}
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
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
				<p class="max-w-sm mt-4 text-c-on-bg/60 text-left leading-relaxed">
					{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
						{$LL.SignUp.PageParagraphConfirm()}
					{:else}
						{$LL.SignUp.PageParagraph()}
					{/if}
				</p>
				<form
					on:input={(errorText = null)}
					disabled={signupStatus === 'signup-loading' || signupStatus === 'otp-loading'}
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
								type="text"
								title="6-Digit Code"
								bind:value={otp}
							/>
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
							/>
							<Input
								disabled={signupStatus === 'signup-loading'}
								type="password"
								title={$LL.Shared.PasswordInput.Placeholder()}
								bind:value={password}
								class="mt-2"
							/>
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
					<NoBgButton prefetch target="_self" href="/login" class="-mt-2 text-c-primary">
						{$LL.SignUp.LoginInsteadButton()}
					</NoBgButton>
				</div>
			</div>
		{/if}
	</div>
</div>
