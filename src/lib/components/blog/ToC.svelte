<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import LinkButton from '$components/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { windowHeight } from '$ts/stores/window';
	import { navbarHeight } from '$ts/stores/navbarHeight';

	export let toc: string;
	export { classes as class };
	let classes = 'hidden lg:flex';
</script>

<div
	style={$windowHeight && $navbarHeight
		? `max-height: calc(${
				$windowHeight - $navbarHeight
		  }px - 2rem); top: calc(${$navbarHeight}+2rem)`
		: 'max-height: calc(100vh-7rem); max-height: calc(100svh-7rem); top: 6rem'}
	class="self-stretch flex flex-col sticky top-24 mt-1 px-5 {classes}"
>
	<div class="h-full absolute right-0 top-0">
		<div class="h-full w-2px bg-c-on-bg/5 rounded-full" />
	</div>
	<div
		class="h-full items-start justify-start flex flex-col 
		self-stretch"
	>
		<div class="w-full flex justify-center mb-1">
			<LinkButton href="/blog" prefetch={true}>
				<div class="flex items-center justify-center gap-2.5 px-2 py-1">
					<IconBack
						class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
						{!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
					/>
					<p class="font-bold">{$LL.Blog.BackToBlogButton()}</p>
				</div>
			</LinkButton>
		</div>
		<SocialBar />
		<div class="w-full h-2px bg-c-on-bg/5 rounded-full my-4" />
		<nav class="toc max-h-full overflow-y-auto max-w-[15rem] pb-16">
			{@html toc}
		</nav>
	</div>
</div>
