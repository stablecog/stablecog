<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import ErrorLine from '$components/ErrorLine.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
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
			errorText = $LL.Error.PasswordTooShort();
			return;
		}
		if (!email.includes('@')) {
			errorText = $LL.Error.InvalidEmail();
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
			errorText = $LL.Error.SomethingWentWrong();
			return;
		}
		console.log(lData);
		setTimeout(() => {
			loginStatus = 'success';
		}, 200);
		await goto(data.redirect_to || defaultRedirectRoute);
	}
</script>

<MetaTag
	title="Login | Stablecog"
	description="Login to Stablecog and use it with all features that are available to your account."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if loginStatus === 'success'}
			<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
		{:else}
			<h1 class="text-center font-bold text-4xl">{$LL.Login.PageTitle()}</h1>
			<div class="w-full flex flex-col items-center justify-start mt-4">
				<p class="max-w-sm text-c-on-bg/60 text-left leading-relaxed">
					{$LL.Login.PageParagraph()}
				</p>
				<form
					on:input={(errorText = null)}
					disabled={loginStatus === 'loading'}
					on:submit|preventDefault={login}
					class="w-full bg-c-bg-secondary max-w-sm flex flex-col p-4 md:p-5 rounded-3xl mt-6
          ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
				>
					<div class="w-full flex flex-col justify-start">
						<Input
							disabled={loginStatus === 'loading'}
							type="email"
							title={$LL.Shared.EmailInput.Placeholder()}
							bind:value={email}
						/>
						<Input
							disabled={loginStatus === 'loading'}
							type="password"
							title={$LL.Shared.PasswordInput.Placeholder()}
							bind:value={password}
							class="mt-2"
						/>
					</div>
					{#if errorText}
						<ErrorLine text={errorText} class="text-xs" />
					{/if}
					<Button class="mt-4" loading={loginStatus === 'loading'} withSpinner>
						{$LL.Shared.LoginButton()}
					</Button>
				</form>
				<div class="w-full flex flex-col items-center justify-center mt-6">
					<p class="text-sm text-c-on-bg/50">{$LL.Login.DontHaveAnAccountTitle()}</p>
					<NoBgButton prefetch target="_self" href="/signup" class="-mt-2 text-c-primary">
						{$LL.Login.SignUpInsteadButton()}
					</NoBgButton>
				</div>
			</div>
		{/if}
	</div>
</div>
