<script lang="ts">
	import SignInModal from '$components/modals/SignInModal.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { sessionStore } from '$ts/constants/supabase';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import { userSummary } from '$ts/stores/user/summary';

	export let title: string;
	export let paragraph: string;
	export let icon: ConstructorOfATypedSvelteComponent;

	$: showSignIn = !$sessionStore?.user.id || !$userSummary;
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto text-center">
		<svelte:component this={icon} class="w-28 h-28" />
		<p class="text-3xl font-bold mt-4">{title}</p>
		<p class="text-c-on-bg/60 mt-3 w-full max-w-xs leading-relaxed">
			{paragraph}
		</p>
		{#if showSignIn}
			<Button class="mt-5" onClick={() => isSignInModalOpen.set(true)}>
				{$LL.Shared.TryAgainButton()}
			</Button>
		{/if}
		<div class="h-[5vh]" />
	</div>
</PageWrapper>
