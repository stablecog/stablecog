<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';

	let email: string;
	let password: string;

	let loginStatus: 'loading' | 'idle' = 'idle';
	let logoutStatus: 'loading' | 'idle' = 'idle';

	async function login() {
		if (!supabase) {
			console.log('Supabase not initialized');
			return;
		}
		loginStatus = 'loading';
		try {
			const { data: d, error: e } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (d.user?.id) {
				await goto('/admin');
			}
		} catch (error) {
			console.log(error);
		}
		loginStatus = 'idle';
	}

	async function logout() {
		logoutStatus = 'loading';
		try {
			const res = await supabase?.auth.signOut();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		logoutStatus = 'idle';
	}
</script>

<MetaTag
	title="Login | Admin"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-5 pt-8 pb-[calc(3vh+1rem)]">
	<div
		class="w-full ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] bg-c-bg-secondary flex flex-col justify-start px-4 py-5 max-w-sm 
    my-auto rounded-2xl relative overflow-hidden z-0 origin-top"
	>
		{#if $page.data.session?.user}
			<div class="w-full flex flex-col gap-6 text-center">
				<p class="font-bold text-lg">{$page.data.session.user.email}</p>
				<Button withSpinner={true} onClick={logout} loading={logoutStatus === 'loading'}>
					{$LL.Shared.LogoutButton()}
				</Button>
			</div>
		{:else}
			<form
				class="w-full flex flex-col gap-4"
				disabled={loginStatus === 'loading'}
				on:submit|preventDefault={login}
			>
				<div class="w-full flex flex-col gap-2">
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
					/>
				</div>
				<Button withSpinner={true} loading={loginStatus === 'loading'}>
					{$LL.Shared.LoginButton()}
				</Button>
			</form>
		{/if}
	</div>
</div>
