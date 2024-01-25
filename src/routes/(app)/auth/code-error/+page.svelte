<script lang="ts">
	import { page } from '$app/stores';
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import SignInModal from '$components/modals/SignInModal.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { sessionStore } from '$ts/constants/supabase';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import { searchParamsString } from '$ts/stores/searchParamsString';
	import { userSummary } from '$ts/stores/user/summary';


  $: showSignIn = !$sessionStore?.user.id || !$userSummary;
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto text-center">
			<IconHourglass class="w-28 h-28" />
			<p class="text-3xl font-bold mt-4">{$LL.Error.LinkExpired.TitleAlt()}</p>
			<p class="text-c-on-bg/60 mt-3 w-full max-w-xs leading-relaxed">
				{$LL.Error.LinkExpired.Paragraph()}
			</p>
      {#if showSignIn}
        <Button class='mt-5' onClick={()=>isSignInModalOpen.set(true)}>
          {$LL.Shared.TryAgainButton()}
        </Button>
      {/if}
      <div class='h-[5vh]'/>
	</div>
</PageWrapper>


{#if $isSignInModalOpen && showSignIn}
	<SignInModal
		redirectTo={($page.url.pathname === '/' ? '/generate' : $page.url.pathname) +
			$searchParamsString}
		onClickoutside={() => isSignInModalOpen.set(false)}
	/>
{/if}