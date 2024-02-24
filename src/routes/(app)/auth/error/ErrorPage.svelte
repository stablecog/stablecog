<script lang="ts">
	import IconMegaphone from '$components/icons/IconMegaphone.svelte';
	import IconRepeat from '$components/icons/IconRepeat.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrls } from '$ts/constants/social';
	import { sessionStore } from '$ts/constants/supabase';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen';
	import { userSummary } from '$ts/stores/user/summary';

	export let title: string;
	export let paragraph: string;
	export let icon: ConstructorOfATypedSvelteComponent;
	export let report: { subject: string; body: string } | undefined = undefined;

	$: showSignIn = !$sessionStore?.user.id || !$userSummary;
</script>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-center text-center">
		<svelte:component this={icon} class="h-28 w-28" />
		<p class="mt-6 text-3xl font-bold">{title}</p>
		<p class="mt-3 w-full max-w-xs leading-relaxed text-c-on-bg/60">
			{paragraph}
		</p>
		<div class="mt-6 flex w-full flex-col">
			{#if showSignIn}
				<div class="flex w-full flex-col items-center justify-center gap-3 md:flex-row">
					<Button
						icon={IconRepeat}
						iconProps={{ strokeWidth: 2 }}
						class="w-full max-w-lg md:w-auto"
						onClick={() => isSignInModalOpen.set(true)}
					>
						{$LL.Shared.TryAgainButton()}
					</Button>
					{#if report}
						<Button
							icon={IconMegaphone}
							iconProps={{ strokeWidth: 2 }}
							class="w-full max-w-lg md:w-auto"
							type="on-bg"
							target="_blank"
							href={socialAppUrls.email + `?subject=${report.subject}&body=${report.body}`}
						>
							{$LL.Shared.ReportErrorButton()}
						</Button>
					{/if}
				</div>
			{:else}
				<Button href="/generate">
					{$LL.Shared.StartGeneratingButton()}
				</Button>
			{/if}
		</div>
		<div class="h-[5vh]" />
	</div>
</PageWrapper>
