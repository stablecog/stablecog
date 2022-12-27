<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconEmail from '$components/icons/IconEmail.svelte';
	import IconPassword from '$components/icons/IconPassword.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { supabase } from '$ts/constants/supabase';

	let email: string;
	let password: string;

	let signInStatus: 'loading' | 'idle' = 'idle';
	let signOutStatus: 'loading' | 'idle' = 'idle';

	async function signIn() {
		if (!supabase) {
			console.log('Supabase not initialized');
			return;
		}
		signInStatus = 'loading';
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
		signInStatus = 'idle';
	}

	async function signOut() {
		signOutStatus = 'loading';
		try {
			const res = await supabase?.auth.signOut();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		signOutStatus = 'idle';
	}
</script>

<MetaTag
	title="Sign In | Admin"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div
		class="w-full ring-2 ring-c-bg-tertiary shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] bg-c-bg-secondary flex flex-col justify-start px-4 py-5 max-w-sm 
    my-auto rounded-2xl relative overflow-hidden z-0 origin-top"
	>
		{#if $page.data.session?.user}
			<div class="w-full flex flex-col gap-6 text-center">
				<p class="font-bold text-lg">{$page.data.session.user.email}</p>
				<Button withSpinner={true} onClick={signOut} loading={signOutStatus === 'loading'}>
					{$LL.SignIn.SignOutButton()}
				</Button>
			</div>
		{:else}
			<form class="w-full flex flex-col gap-4" on:submit|preventDefault={signIn}>
				<div class="w-full flex flex-col gap-2">
					<Input
						disabled={signInStatus === 'loading'}
						type="email"
						title={$LL.Shared.EmailInput.Placeholder()}
						bind:value={email}
						hasIcon
					>
						<IconEmail slot="icon" class="w-full h-full" />
					</Input>
					<Input
						disabled={signInStatus === 'loading'}
						type="password"
						title={$LL.Shared.PasswordInput.Placeholder()}
						bind:value={password}
						hasIcon
					>
						<IconPassword slot="icon" class="w-full h-full" />
					</Input>
				</div>
				<Button withSpinner={true} loading={signInStatus === 'loading'}>
					{$LL.SignIn.SignInButton()}
				</Button>
			</form>
		{/if}
	</div>
</PageWrapper>
