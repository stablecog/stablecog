<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { env as envPublic } from '$env/dynamic/public';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount } from 'svelte';

	onMount(() => {
		window.location.assign(envPublic.PUBLIC_DISCORD_INVITE_URL);
	});
</script>

<MetaTag
	title="Discord | Stablecog"
	description="Join our Discord server to get updates on Stablecog, share your generations, and more!"
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-lg">
		<div class="w-full flex flex-col items-center justify-start py-4">
			<div
				class="flex items-center justify-center relative overflow-hidden z-0 rounded-full -m-1.5"
			>
				<div class="p-7 relative overflow-hidden z-0 rounded-full">
					<div class="absolute w-full h-full left-0 top-0 origin-center">
						<div class="w-full h-full">
							<div
								class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
							/>
						</div>
					</div>
					<div class="w-10 h-10 relative">
						<div
							class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
						/>
						<div
							class="w-full h-full rounded-full transition-all duration-300 flex 
                items-center justify-center relative overflow-hidden z-0 bg-c-primary"
						/>
					</div>
				</div>
			</div>
			<p class="w-full text-c-on-bg/40 text-center mt-1.5">Redirecting to Discord</p>
		</div>
	</div>
</div>
