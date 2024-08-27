<script lang="ts">
	import { page } from '$app/stores';
	import SignInCard from '$components/cards/SignInCard.svelte';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import PlatformCard from '$routes/(app)/account/apps/authorize/PlatformCard.svelte';
	import { getAppFromAppId } from '$routes/(app)/account/apps/helpers.js';
	import type { TConnectionStatus } from '$routes/(app)/connect/types.js';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';
	import { approveAppAuthorization } from '$ts/helpers/user/user.js';
	import { userSummary } from '$ts/stores/user/summary.js';

	export let data;

	let status: TConnectionStatus = 'idle';
	let statusError: string | undefined = undefined;

	$: platform = getAppFromAppId(data.app_id, $LL);

	async function authorizeApp() {
		if (!$sessionStore?.access_token) return;
		if (!data.app_id || !data.app_code) return;
		status = 'confirming';
		statusError = undefined;
		try {
			const res = await approveAppAuthorization({
				access_token: $sessionStore.access_token,
				app_id: data.app_id,
				app_code: data.app_code
			});
			console.log(res);
			status = 'success';
			if (!res.redirect_url) throw new Error('No redirect url');
			setTimeout(() => {
				window.location.href = res.redirect_url;
			}, 300);
		} catch (e) {
			console.log(e);
			status = 'error';
		}
	}
</script>

<MetaTag
	title="Authorize App | Stablecog"
	description="Authorize an app to use Stablecog."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section id="connect" class="flex w-full flex-col items-center justify-start">
			{#if !data.app_id || !data.app_code || !platform}
				<IconSadFaceOutline class="h-20 w-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center text-3xl font-bold text-c-danger md:text-4xl">
					{$LL.Account.Apps.Authorize.PageTitleFallback()}
				</h1>
				<p
					class="mt-2 w-full max-w-sm text-center text-base text-c-on-bg/75 md:mt-3 md:max-w-md md:text-lg"
				>
					{!data.app_id || !platform
						? $LL.Account.Apps.Authorize.Error.NoValidAppIdParagraph()
						: !data.app_code
							? $LL.Account.Apps.Authorize.Error.NoValidCodeParagraph()
							: $LL.Error.SomethingWentWrong()}
				</p>
			{:else if !$sessionStore?.access_token || !$sessionStore.user.email || !$userSummary}
				<div class="mt-6 flex items-center justify-center">
					<SignInCard
						redirectTo={`${$page.url.pathname}?${$page.url.searchParams}`}
						title={$LL.Account.Apps.Authorize.SignInTitle({
							platform: platform.localizedName
						})}
						paragraph={$LL.Account.Apps.Authorize.SignInParagraph({
							platform: platform.localizedName
						})}
					/>
				</div>
			{:else}
				<h1
					class="w-full max-w-sm text-center text-3xl font-bold md:text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success'
						? $LL.Account.Apps.Authorize.PageSuccessTitle()
						: $LL.Account.Apps.Authorize.PageTitle({
								platform: platform.localizedName
							})}
				</h1>
				<p
					class="mt-2 w-full max-w-sm text-center text-base text-c-on-bg/75 md:mt-3 md:max-w-md md:text-lg"
				>
					{status === 'success'
						? $LL.Account.Apps.Authorize.PageSuccessParagraph({
								platform: platform.localizedName
							})
						: $LL.Account.Apps.Authorize.PageParagraph({
								platform: platform.localizedName
							})}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse={{ duration: 300 }}
						class="flex w-full max-w-lg flex-col items-center justify-start"
					>
						<div class="flex w-full flex-col items-center justify-start pb-4 pt-5 md:pb-0">
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
									class="flex w-full flex-col items-center justify-start"
								>
									<div class="flex w-full flex-col items-center justify-start pt-5">
										<ErrorChip size="sm" error={$LL.Error.SomethingWentWrong()} />
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
				<div
					class="mt-4 flex max-w-full flex-col items-center justify-center gap-4 md:mt-8 md:flex-row"
				>
					<!-- Platform Info -->
					<PlatformCard
						icon={platform.icon}
						side="start"
						platform={platform.localizedName}
						{status}
					/>
					<!-- Connection div -->
					<div class="relative flex flex-col items-center justify-center gap-2 md:flex-row">
						<div
							class="h-4 w-2px rounded-full transition duration-300 md:h-2px md:w-6 {status ===
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
								class="h-6 w-6 transition duration-300 md:h-8 md:w-8 {status === 'success'
									? 'text-c-success'
									: 'text-c-on-bg/30'}"
							/>
						</div>
						<div
							class="h-4 w-2px rounded-full transition duration-300 md:h-2px md:w-6 {status ===
							'success'
								? 'bg-c-success'
								: 'bg-c-on-bg/20'}"
						/>
					</div>
					<!-- Stablecog Info -->
					<PlatformCard icon="stablecog" side="end" platform={$LL.Platform.Stablecog()} {status} />
				</div>
			{/if}
		</section>
	</div>
</PageWrapper>
