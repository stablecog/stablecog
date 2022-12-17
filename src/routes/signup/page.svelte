<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import Input from '$components/Input.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { supabase } from '$ts/constants/supabase';

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

	async function signup() {
		if (!supabase) return;
		if (password.length < 8) {
			errorText = 'Password must be at least 8 characters long';
			return;
		}
		if (!email.includes('@')) {
			errorText = 'Please enter a valid email address';
			return;
		}
		signupStatus = 'signup-loading';
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.log(error);
			signupStatus = 'signup-error';
			errorText = 'Something went wrong. Try again.';
			return;
		}
		console.log(data);
		signupStatus = 'otp';
	}

	async function confirm() {
		if (!supabase) return;
		signupStatus = 'otp-loading';
		const { data, error } = await supabase.auth.verifyOtp({
			email: email,
			token: otp,
			type: 'signup'
		});
		if (error) {
			console.log(error);
			signupStatus = 'otp-error';
			errorText = 'Wrong code, try again.';
			return;
		}
		console.log(data);
		signupStatus = 'success';
	}
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-center my-auto">
		<h1 class="text-center font-bold text-4xl">
			{#if signupStatus === 'success'}
				Thanks for signing up!
			{:else if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
				Confirm
			{:else}
				Sign Up
			{/if}
		</h1>
		{#if signupStatus !== 'success'}
			<div
				transition:expandCollapse|local={{ duration: 200 }}
				class="w-full flex flex-col items-center justify-start"
			>
				<p class="max-w-sm mt-4 text-c-on-bg/60 text-left leading-relaxed">
					{#if signupStatus === 'otp' || signupStatus === 'otp-loading' || signupStatus === 'otp-error'}
						We've emailed you a 6-digit code. Enter it below to confirm your account.
					{:else}
						Sign up to <span class="text-c-primary font-semibold">become a pro member</span>. Get
						access to different image dimensions, full speed generations, steps and more.
					{/if}
				</p>
				<form
					on:input={(errorText = null)}
					disabled={signupStatus === 'signup-loading' || signupStatus === 'otp-loading'}
					on:submit|preventDefault={signupStatus === 'otp' || signupStatus === 'otp-error'
						? confirm
						: signup}
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-8
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
								title="Email"
								bind:value={email}
							/>
							<Input
								disabled={signupStatus === 'signup-loading'}
								type="password"
								title="Password"
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
							Confirm
						{:else}
							Sign Up
						{/if}
					</Button>
				</form>
			</div>
		{/if}
	</div>
</div>
