<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import Button from '$components/buttons/Button.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import { userSummary } from '$ts/stores/user/summary.js';
	import SignInCard from '$components/SignInCard.svelte';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import type { TConnectionStatus } from '$routes/(app)/connect/types.js';
	import PlatformCard from '$routes/(app)/account/apps/authorize/PlatformCard.svelte';
	import { approveAppAuthorization } from '$ts/helpers/user/user.js';

	export let data;

	let status: TConnectionStatus = 'idle';
	let statusError: string | undefined = undefined;

	$: platformString =
		data.app_id === 'e1d7e2fd-a173-473b-98f2-680d14283e75'
			? $LL.Account.Apps.Authorize.Platform.Raycast()
			: null;

	async function authorizeApp() {
		if (!$page.data.session?.access_token) return;
		if (!data.app_id || !data.app_code) return;
		status = 'confirming';
		statusError = undefined;
		try {
			const res = await approveAppAuthorization({
				access_token: $page.data.session.access_token,
				app_id: data.app_id,
				app_code: data.app_code
			});
			status = 'success';
			if (!res.redirect_url) throw new Error('No redirect url');
			setTimeout(() => {
				window.location.href = res.redirect_url;
			}, 250);
		} catch (e) {
			console.log(e);
			status = 'error';
		}
	}
</script>

<MetaTag
	title="Authorize App | Stablecog"
	description="Authorize an app to use Stablecog."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="connect" class="w-full flex flex-col items-center justify-start">
			{#if !data.app_id || !data.app_code || !platformString}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center font-bold text-3xl md:text-4xl text-c-danger">
					{$LL.Account.Apps.Authorize.PageTitleFallback()}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{!data.app_id || !platformString
						? $LL.Account.Apps.Authorize.Error.NoValidAppIdParagraph()
						: !data.app_code
						? $LL.Account.Apps.Authorize.Error.NoValidCodeParagraph()
						: $LL.Error.SomethingWentWrong()}
				</p>
			{:else if !$page.data.session?.access_token || !$page.data.session.user.email || !$userSummary}
				<div class="flex items-center justify-center mt-6">
					<SignInCard
						redirectTo={`${$page.url.pathname}?${$page.url.searchParams}`}
						title={$LL.Account.Apps.Authorize.SignInTitle({
							platform: platformString
						})}
						paragraph={$LL.Account.Apps.Authorize.SignInParagraph({
							platform: platformString
						})}
					/>
				</div>
			{:else}
				<h1
					class="w-full max-w-sm text-center font-bold text-3xl md:text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success'
						? $LL.Account.Apps.Authorize.PageSuccessTitle()
						: $LL.Account.Apps.Authorize.PageTitle({
								platform: platformString
						  })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{status === 'success'
						? $LL.Account.Apps.Authorize.PageSuccessParagraph({
								platform: platformString
						  })
						: $LL.Account.Apps.Authorize.PageParagraph({
								platform: platformString
						  })}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse={{ duration: 300 }}
						class="w-full max-w-lg flex flex-col justify-start items-center"
					>
						<div class="w-full flex flex-col justify-start items-center pt-5 pb-4 md:pb-0">
							<Button
								onClick={authorizeApp}
								withSpinner
								loading={status === 'confirming'}
								class="w-56 max-w-full"
							>
								{$LL.Account.Apps.Authorize.AuthorizeButton()}
							</Button>
							{#if status === 'error'}
								<div
									transition:expandCollapse={{ duration: 200 }}
									class="w-full flex flex-col justify-start items-center"
								>
									<div class="w-full flex flex-col justify-start items-center pt-5">
										<ErrorChip size="sm" error={$LL.Error.SomethingWentWrong()} />
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
				<div
					class="max-w-full flex flex-col md:flex-row items-center justify-center mt-4 md:mt-8 gap-4"
				>
					<!-- Platform Info -->
					<PlatformCard
						icon="raycast"
						side="start"
						platform={$LL.Account.Apps.Authorize.Platform.Raycast()}
						{status}
					/>
					<!-- Connection div -->
					<div class="relative flex flex-col md:flex-row justify-center items-center gap-2">
						<div
							class="w-2px h-4 md:w-6 md:h-2px rounded-full transition duration-300 {status ===
							'success'
								? 'bg-c-success'
								: 'bg-c-on-bg/20'}"
						/>
						<div
							class="transform transition duration-300 {status === 'success'
								? '-rotate-45 md:rotate-45'
								: ''}"
						>
							<IconLink
								class="w-6 h-6 md:w-8 md:h-8 transition duration-300 {status === 'success'
									? 'text-c-success'
									: 'text-c-on-bg/30'}"
							/>
						</div>
						<div
							class="w-2px h-4 md:w-6 md:h-2px rounded-full transition duration-300 {status ===
							'success'
								? 'bg-c-success'
								: 'bg-c-on-bg/20'}"
						/>
					</div>
					<!-- Stablecog Info -->
					<PlatformCard
						icon="stablecog"
						side="end"
						platform={$LL.Account.Apps.Authorize.Platform.Stablecog()}
						{status}
					/>
				</div>
			{/if}
		</section>
	</div>
</PageWrapper>
