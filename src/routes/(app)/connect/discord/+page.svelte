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

	export let data;

	type TStatus = 'idle' | 'confirming' | 'error' | 'success';

	let status: TStatus = 'idle';

	async function connectAccount() {
		status = 'confirming';
		await new Promise((resolve) => setTimeout(resolve, 2000));
		try {
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
					<SignInCard redirectTo={`${$page.url.pathname}?${$page.url.searchParams}`} />
				</div>
			{:else if !data.discord_id}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-1 w-full max-w-sm text-center font-bold text-4xl text-c-danger">
					{$LL.Connect.PageTitle()}
				</h1>
				<p class="w-full max-w-md mt-2 text-xl text-c-on-bg/75 text-center">
					{$LL.Connect.NoDiscordIDParagraph()}
				</p>
			{:else if !data.discord_token}
				<IconSadFaceOutline class="w-20 h-20 text-c-danger" />
				<h1 class="mt-1 w-full max-w-sm text-center font-bold text-4xl text-c-danger">
					{$LL.Connect.PageTitle()}
				</h1>
				<p class="w-full max-w-md mt-2 text-xl text-c-on-bg/75 text-center">
					{$LL.Connect.NoDiscordTokenParagraph()}
				</p>
			{:else}
				<h1
					class="w-full max-w-sm text-center font-bold text-4xl {status === 'success'
						? 'text-c-success'
						: 'text-c-on-bg'}"
				>
					{status === 'success' ? $LL.Connect.PageSuccessTitle() : $LL.Connect.PageTitle()}
				</h1>
				<p class="w-full max-w-md mt-2 text-xl text-c-on-bg/75 text-center">
					{status === 'success'
						? $LL.Connect.ReturnBackToParagraph({ platform: $LL.Connect.Platform.Discord() })
						: $LL.Connect.PageParagraph({ platform: $LL.Connect.Platform.Discord() })}
				</p>
				{#if status !== 'success'}
					<div
						out:expandCollapse|local={{ duration: 300 }}
						class="w-full flex flex-col justify-start items-center"
					>
						<Button
							onClick={connectAccount}
							withSpinner
							loading={status === 'confirming'}
							class="mt-5 w-56 max-w-full"
						>
							{$LL.Connect.ConnectButton()}
						</Button>
					</div>
				{/if}
				<div class="max-w-full flex flex-col md:flex-row items-center justify-center mt-8 gap-4">
					<!-- Platform Info -->
					<div
						class="w-64 max-w-full transition duration-300 transform {status === 'success'
							? 'ring-c-success ring-3 translate-y-4 md:translate-y-0 md:translate-x-4'
							: 'ring-c-bg-tertiary ring-2'} bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
						flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
					>
						<div class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 px-4 gap-2">
							<IconSc type="discord" class="w-8 h-8 flex-shrink-0" />
							<p
								class="font-bold text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
							>
								{$LL.Connect.Platform.Discord()}
							</p>
						</div>
						<div
							class="mt-4 w-12 h-12 md:w-18 md:h-18 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition duration-300 transform relative"
						>
							<Avatar
								str={$page.data.session.user.email}
								class="w-9 h-9 transform scale-200 relative"
							/>
						</div>
						<p
							class="w-full font-semibold mt-1 px-6 pb-4 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							@yekta
						</p>
					</div>
					<!-- Connection div -->
					<div class="relative flex flex-col md:flex-row justify-center items-center gap-2">
						<div
							class="w-2px h-6 md:w-8 md:h-2px rounded-full transition duration-300 {status ===
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
							class="w-2px h-6 md:w-8 md:h-2px rounded-full transition duration-300 {status ===
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
						<div class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 px-4 gap-1">
							<IconSc type="stablecog" class="w-8 h-8 flex-shrink-0 transition duration-300" />
							<p
								class="font-bold text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
							>
								{$LL.Connect.Platform.Stablecog()}
							</p>
						</div>
						<div
							class="mt-4 w-12 h-12 md:w-18 md:h-18 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition duration-300 transform relative"
						>
							<Avatar
								str={$page.data.session.user.email}
								class="w-9 h-9 transform scale-200 relative"
							/>
						</div>
						<p
							class="w-full font-semibold mt-1 px-6 pb-4 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							{$page.data.session.user.email}
						</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</PageWrapper>
