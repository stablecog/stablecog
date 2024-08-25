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
	import ConnectCard from '$routes/(app)/connect/ConnectCard.svelte';
	import type { TConnectionStatus } from '$routes/(app)/connect/types.js';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import { auxBucketStaticUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';
	import { connectAccountToDiscord } from '$ts/helpers/user/user.js';
	import { userSummary } from '$ts/stores/user/summary.js';

	export let data;

	let status: TConnectionStatus = 'idle';
	let statusError: string | undefined = undefined;

	async function _connectToDiscord() {
		if (!$sessionStore?.access_token) return;
		if (!data.platform_user_id || !data.platform_token) return;
		status = 'confirming';
		statusError = undefined;
		try {
			const res = await connectAccountToDiscord({
				access_token: $sessionStore.access_token,
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
	image_url="{auxBucketStaticUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section id="connect" class="flex w-full flex-col items-center justify-start">
			{#if !$sessionStore?.access_token || !$sessionStore.user.email || !$userSummary}
				<div class="mt-6 flex items-center justify-center">
					<SignInCard
						redirectTo={`${$page.url.pathname}?${$page.url.searchParams}`}
						title={$LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
						paragraph={$LL.Connect.ConnectToParagraph({ platform: $LL.Platform.Discord() })}
					/>
				</div>
			{:else if !data.platform_user_id || !data.platform_token || !data.platform_username}
				<IconSadFaceOutline class="h-20 w-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center text-3xl font-bold text-c-danger md:text-4xl">
					{$LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
				</h1>
				<p
					class="mt-2 w-full max-w-sm text-center text-base text-c-on-bg/75 md:mt-3 md:max-w-md md:text-lg"
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
					class="w-full max-w-sm text-center text-3xl font-bold md:text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success'
						? $LL.Connect.PageSuccessTitle()
						: $LL.Connect.ConnectToTitle({ platform: $LL.Platform.Discord() })}
				</h1>
				<p
					class="mt-2 w-full max-w-sm text-center text-base text-c-on-bg/75 md:mt-3 md:max-w-md md:text-lg"
				>
					{status === 'success'
						? $LL.Connect.ReturnBackToParagraph({ platform: $LL.Platform.Discord() })
						: $LL.Connect.PageParagraph({ platform: $LL.Platform.Discord() })}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse={{ duration: 300 }}
						class="flex w-full max-w-lg flex-col items-center justify-start"
					>
						<div class="flex w-full flex-col items-center justify-start pb-4 pt-5 md:pb-0">
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
									class="flex w-full flex-col items-center justify-start"
								>
									<div class="flex w-full flex-col items-center justify-start pt-5">
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
					class="mt-3 flex max-w-full flex-col items-center justify-center gap-4 md:mt-7 md:flex-row"
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
					<div class="relative flex flex-col items-center justify-center gap-2 md:flex-row">
						<div
							class="h-5 w-2px rounded-full transition duration-300 md:h-2px md:w-6 {status ===
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
							class="h-5 w-2px rounded-full transition duration-300 md:h-2px md:w-6 {status ===
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
