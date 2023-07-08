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

	export let data;
</script>

<MetaTag
	title="Connect to Discord | Stablecog"
	description="Connect your Discord account to your Stablecog account."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="connect" class="w-full flex flex-col items-center justify-start">
			<h1 class="w-full max-w-sm text-center font-bold text-4xl">Connect</h1>
			<p class="w-full max-w-sm mt-2 text-lg text-c-on-bg/75 text-center">
				Click the button below to connect your Discord account to your Stablecog account.
			</p>
			<div class="max-w-full flex flex-col md:flex-row items-center justify-center mt-8 gap-4">
				<!-- Platform Info -->
				<div
					class="w-64 max-w-full ring-2 ring-c-bg-tertiary bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
					flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
				>
					<div class="w-full flex items-center justify-center gap-2 bg-c-bg-tertiary py-2 px-4">
						<IconSc type="discord" class="w-8 h-8 flex-shrink-0" />
						<p
							class="font-bold text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
						>
							Discord
						</p>
					</div>
					<div
						class="mt-4 w-12 h-12 md:w-18 md:h-18 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform relative"
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
					<div class="w-2px h-6 md:w-8 md:h-2px rounded-full bg-c-on-bg/20" />
					<IconLink class="w-6 h-6 md:w-8 md:h-8 text-c-on-bg/30" />
					<div class="w-2px h-6 md:w-8 md:h-2px rounded-full bg-c-on-bg/20" />
				</div>
				<!-- Stablecog Info -->
				<div
					class="w-64 max-w-full ring-2 ring-c-bg-tertiary bg-c-bg-secondary rounded-xl shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
					flex flex-col items-center justify-center gap-2 text-center overflow-hidden z-0 relative"
				>
					<div class="w-full flex items-center justify-center bg-c-bg-tertiary py-2 px-4">
						<IconSc type="stablecog" class="w-8 h-8 flex-shrink-0" />
						<p
							class="font-bold text-xl flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
						>
							Stablecog
						</p>
					</div>
					<div
						class="mt-4 w-12 h-12 md:w-18 md:h-18 flex items-center justify-center ring-2 ring-c-on-bg/25 overflow-hidden rounded-full transition transform relative"
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
			<Button withSpinner class="mt-8 w-56 max-w-full">Connect</Button>
		</section>
	</div>
</PageWrapper>
