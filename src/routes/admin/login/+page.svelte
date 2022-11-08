<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabaseClient } from '$ts/constants/supabaseClient';

	export let data: { admins: string[] };

	let email: string;
	let password: string;

	let loginStatus: 'loading' | 'idle' = 'idle';
	let logoutStatus: 'loading' | 'idle' = 'idle';

	async function login() {
		if (!supabaseClient) {
			console.log('supabaseClient not initialized');
			return;
		}
		loginStatus = 'loading';
		try {
			const { data: d, error: e } = await supabaseClient.auth.signInWithPassword({
				email,
				password
			});
			if (d.user?.id && data.admins.includes(d.user?.id)) {
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
			const res = await supabaseClient?.auth.signOut();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		logoutStatus = 'idle';
	}
</script>

<MetaTag
	title="Login | Admin"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-5 pt-8 pb-[calc(3vh+1rem)]">
	<div
		class="w-full ring-2 ring-c-bg-tertiary bg-c-bg-secondary flex flex-col justify-start px-4 py-5 max-w-sm 
    my-auto rounded-2xl shadow-xl relative overflow-hidden z-0 origin-top shadow-c-shadow/[var(--o-shadow-normal)]"
	>
		{#if $page.data.session?.user}
			<div class="w-full flex flex-col gap-6 text-center">
				<p class="font-bold text-lg">{$page.data.session.user.email}</p>
				<Button withSpinner={true} onClick={logout} loading={logoutStatus === 'loading'}>
					{#if logoutStatus === 'loading'}
						Logging out...
					{:else}
						Logout
					{/if}
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
						placeholder="Email"
						bind:value={email}
					/>
					<Input
						disabled={loginStatus === 'loading'}
						type="password"
						placeholder="Password"
						bind:value={password}
					/>
				</div>
				<Button withSpinner={true} loading={loginStatus === 'loading'}>
					{#if loginStatus === 'loading'}
						Logging in...
					{:else}
						Login
					{/if}
				</Button>
			</form>
		{/if}
	</div>
</div>
