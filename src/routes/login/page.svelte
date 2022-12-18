<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/buttons/Button.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import Input from '$components/Input.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { supabase } from '$ts/constants/supabase';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let email: string;
	let password: string;
	let loginStatus: 'idle' | 'loading' | 'error' | 'success' = 'idle';
	let errorText: string | null = null;
	const defaultRedirectRoute = '/';

	async function login() {
		if (password.length < 8) {
			errorText = 'Password must be at least 8 characters long';
			return;
		}
		if (!email.includes('@')) {
			errorText = 'Please enter a valid email address';
			return;
		}
		loginStatus = 'loading';
		const { data: lData, error: lError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (lError) {
			console.log(lError);
			loginStatus = 'error';
			errorText = 'Something went wrong. Try again.';
			return;
		}
		console.log(lData);
		setTimeout(() => {
			loginStatus = 'success';
		}, 200);
		await goto(data.redirect_to || defaultRedirectRoute);
	}
</script>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if loginStatus === 'success'}
			<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
		{:else}
			<h1 class="text-center font-bold text-4xl">Login</h1>
			<div class="w-full flex flex-col items-center justify-start mt-4">
				<p class="max-w-sm text-c-on-bg/60 text-left leading-relaxed">
					Start using Stablecog with all features that are available to your account.
				</p>
				<form
					on:input={(errorText = null)}
					disabled={loginStatus === 'loading'}
					on:submit|preventDefault={login}
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-8
          ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<div class="w-full flex flex-col justify-start">
						<Input
							disabled={loginStatus === 'loading'}
							type="email"
							title="Email"
							bind:value={email}
						/>
						<Input
							disabled={loginStatus === 'loading'}
							type="password"
							title="Password"
							bind:value={password}
							class="mt-2"
						/>
					</div>
					{#if errorText}
						<ErrorLine text={errorText} class="text-xs" />
					{/if}
					<Button class="mt-4" loading={loginStatus === 'loading'} withSpinner>Login</Button>
				</form>
			</div>
		{/if}
	</div>
</div>
