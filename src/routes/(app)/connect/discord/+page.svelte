<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import Button from '$components/primitives/buttons/Button.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import { userSummary } from '$ts/stores/user/summary.js';
	import SignInCard from '$components/cards/SignInCard.svelte';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { connectAccountToDiscord } from '$ts/helpers/user/user.js';
	import ErrorChip from '$components/error/ErrorChip.svelte';
	import type { TConnectionStatus } from '$routes/(app)/connect/types.js';
	import ConnectCard from '$routes/(app)/connect/ConnectCard.svelte';

	export let data;

	let status: TConnectionStatus = 'idle';
	let statusError: string | undefined = undefined;

	async function _connectToDiscord() {
		if (!$page.data.session?.access_token) return;
		if (!data.platform_user_id || !data.platform_token) return;
		status = 'confirming';
		statusError = undefined;
		try {
			const res = await connectAccountToDiscord({
				access_token: $page.data.session.access_token,
				platform_user_id: data.platform_user_id,
				platform_token: data.platform_token
			});
			if (res.error) {
				statusError = res.error;
				throw new Error(res.error);
			}
			status = 'success';
		} catch (e) {
			console.log(e);
			status = 'error';
		}
	}
</script>

<MetaTag
	title="Connect to Discord | Stablecog"
	description="Connect your Discord account to your Stablecog account."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="connect" class="w-full flex flex-col items-center justify-start">
			{#if !$page.data.session?.access_token || !$page.data.session.user.email || !$userSummary}
				<div class="flex items-center justify-center mt-6">
					<SignInCard
						redirectTo={`${$page.url.pathname}?${$page.url.searchParams}`}
						title={$LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
						paragraph={$LL.Connect.ConnectToParagraph({ platform: $LL.Platform.Discord() })}
					/>
				</div>
			{:else if !data.platform_user_id || !data.platform_token || !data.platform_username}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center font-bold text-3xl md:text-4xl text-c-danger">
					{$LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{!data.platform_user_id
						? $LL.Connect.NoPlatformIDParagraph({ platform: $LL.Platform.Discord() })
						: !data.platform_token
						? $LL.Connect.NoPlatformTokenParagraph({ platform: $LL.Platform.Discord() })
						: !data.platform_username
						? $LL.Connect.NoPlatformUsernameParagraph({ platform: $LL.Platform.Discord() })
						: $LL.Connect.NoPlatformIDParagraph({ platform: $LL.Platform.Discord() })}
				</p>
			{:else}
				<h1
					class="w-full max-w-sm text-center font-bold text-3xl md:text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success'
						? $LL.Connect.PageSuccessTitle()
						: $LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{status === 'success'
						? $LL.Connect.ReturnBackToParagraph({ platform: $LL.Platform.Discord() })
						: $LL.Connect.PageParagraph({ platform: $LL.Platform.Discord() })}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse={{ duration: 300 }}
						class="w-full max-w-lg flex flex-col justify-start items-center"
					>
						<div class="w-full flex flex-col justify-start items-center pt-5 pb-4 md:pb-0">
							<Button
								onClick={_connectToDiscord}
								withSpinner
								loading={status === 'confirming'}
								class="w-56 max-w-full"
							>
								{$LL.Connect.ConnectButton()}
							</Button>
							{#if status === 'error'}
								<div
									transition:expandCollapse={{ duration: 200 }}
									class="w-full flex flex-col justify-start items-center"
								>
									<div class="w-full flex flex-col justify-start items-center pt-5">
										<ErrorChip
											size="sm"
											error={statusError === 'already_linked'
												? $LL.Connect.Error.AlreadyLinked({
														platform: $LL.Platform.Discord()
												  })
												: statusError === 'invalid_token'
												? $LL.Connect.Error.InvalidToken({
														platform: $LL.Platform.Discord()
												  })
												: $LL.Error.SomethingWentWrong()}
										/>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
				<div
					class="max-w-full flex flex-col md:flex-row items-center justify-center mt-3 md:mt-7 gap-4"
				>
					<!-- Platform Info -->
					<ConnectCard
						icon="discord"
						side="start"
						platform={$LL.Platform.Discord()}
						{status}
						src={data.platform_avatar_url}
						srcWidth={128}
						srcHeight={128}
						srcAlt="Discord Avatar"
						username={data.platform_username}
					/>
					<!-- Connection div -->
					<div class="relative flex flex-col md:flex-row justify-center items-center gap-2">
						<div
							class="w-2px h-5 md:w-6 md:h-2px rounded-full transition duration-300 {status ===
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
							class="w-2px h-5 md:w-6 md:h-2px rounded-full transition duration-300 {status ===
							'success'
								? 'bg-c-success'
								: 'bg-c-on-bg/20'}"
						/>
					</div>
					<!-- Stablecog Info -->
					<ConnectCard
						icon="stablecog"
						side="end"
						platform={$LL.Platform.Stablecog()}
						{status}
						username={$userSummary.username}
					/>
				</div>
			{/if}
		</section>
	</div>
</PageWrapper>
