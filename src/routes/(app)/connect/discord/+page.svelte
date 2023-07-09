<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import ScBar from '$components/ScBar.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import Logo from '$components/Logo.svelte';
	import Avatar from '$components/Avatar.svelte';
	import Button from '$components/buttons/Button.svelte';
	import IconSc from '$components/icons/IconSc.svelte';
	import IconLink from '$components/icons/IconLink.svelte';
	import { userSummary } from '$ts/stores/user/summary.js';
	import SignInCard from '$components/SignInCard.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social.js';
	import { expandCollapse } from '$ts/animation/transitions.js';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { connectAccountToDiscord } from '$ts/helpers/user/user.js';
	import ErrorChip from '$components/error/ErrorChip.svelte';

	export let data;

	type TStatus = 'idle' | 'confirming' | 'error' | 'success';

	let status: TStatus = 'idle';
	let statusError: string | undefined = undefined;

	async function _connectToDiscord() {
		if (!$page.data.session?.access_token) return;
		if (!data.discord_id || !data.discord_token) return;
		status = 'confirming';
		statusError = undefined;
		try {
			const res = await connectAccountToDiscord({
				access_token: $page.data.session.access_token,
				discord_id: data.discord_id,
				discord_token: data.discord_token
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
						title={$LL.Connect.ConnectToTitle({ platform: $LL.Connect.Platform.Discord() })}
						paragraph={$LL.Connect.ConnectToParagraph({ platform: $LL.Connect.Platform.Discord() })}
					/>
				</div>
			{:else if !data.discord_id}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center font-bold text-3xl md:text-4xl text-c-danger">
					{$LL.Connect.ConnectToTitle({ platform: $LL.Connect.Platform.Discord() })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{$LL.Connect.NoDiscordIDParagraph()}
				</p>
			{:else if !data.discord_token}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-3 w-full max-w-sm text-center font-bold text-3xl md:text-4xl text-c-danger">
					{$LL.Connect.ConnectToTitle({ platform: $LL.Connect.Platform.Discord() })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{$LL.Connect.NoDiscordTokenParagraph()}
				</p>
			{:else}
				<h1
					class="w-full max-w-sm text-center font-bold text-3xl md:text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success'
						? $LL.Connect.PageSuccessTitle()
						: $LL.Connect.ConnectToTitle({ platform: $LL.Connect.Platform.Discord() })}
				</h1>
				<p
					class="w-full max-w-sm md:max-w-md mt-2 md:mt-3 text-base md:text-lg text-c-on-bg/75 text-center"
				>
					{status === 'success'
						? $LL.Connect.ReturnBackToParagraph({ platform: $LL.Connect.Platform.Discord() })
						: $LL.Connect.PageParagraph({ platform: $LL.Connect.Platform.Discord() })}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse|local={{ duration: 300 }}
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
									transition:expandCollapse|local={{ duration: 200 }}
									class="w-full flex flex-col justify-start items-center"
								>
									<div class="w-full flex flex-col justify-start items-center pt-5">
										<ErrorChip
											error={statusError === 'already_linked'
												? $LL.Connect.Error.AlreadyLinked({
														platform: $LL.Connect.Platform.Discord()
												  })
												: statusError === 'invalid_token'
												? $LL.Connect.Error.InvalidToken({
														platform: $LL.Connect.Platform.Discord()
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
					class="max-w-full flex flex-col md:flex-row items-center justify-center mt-4 md:mt-8 gap-4"
				>
					<!-- Platform Info -->
					<div
						class="w-64 max-w-full transition duration-300 transform {status === 'success'
							? 'ring-c-success ring-3 translate-y-4 md:translate-y-0 md:translate-x-4'
							: 'ring-c-bg-tertiary ring-2'} bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
						flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
					>
						<div
							class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 md:py-2.5 px-4 gap-2"
						>
							<IconSc type="discord" class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
							<p
								class="font-bold text-lg md:text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
							>
								{$LL.Connect.Platform.Discord()}
							</p>
						</div>
						<div
							class="mt-2.5 md:mt-4 w-9 h-9 md:w-14 md:h-14 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition duration-300 transform relative"
						>
							<Avatar
								str={$page.data.session.user.email}
								class="w-9 h-9 transform scale-[100%] md:scale-[156%] relative"
							/>
						</div>
						<p
							class="w-full font-semibold mt-1 px-5 md:px-6 pb-3 md:pb-5 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							@yekta
						</p>
					</div>
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
					<div
						class="w-64 max-w-full transition duration-300 transform {status === 'success'
							? 'ring-c-success ring-3 -translate-y-4 md:translate-y-0 md:-translate-x-4'
							: 'ring-c-bg-tertiary ring-2'} bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
						flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
					>
						<div
							class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 md:py-2.5 px-4 gap-1"
						>
							<IconSc
								type="stablecog"
								class="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 transition duration-300"
							/>
							<p
								class="font-bold text-lg md:text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
							>
								{$LL.Connect.Platform.Stablecog()}
							</p>
						</div>
						<div
							class="mt-2.5 md:mt-4 w-9 h-9 md:w-14 md:h-14 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition duration-300 transform relative"
						>
							<Avatar
								str={$page.data.session.user.email}
								class="w-9 h-9 transform scale-[100%] md:scale-[156%] relative"
							/>
						</div>
						<p
							class="w-full font-semibold mt-1 px-5 md:px-6 pb-3 md:pb-5 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							{$page.data.session.user.email}
						</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</PageWrapper>
