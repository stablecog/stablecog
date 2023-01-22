<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import { companyInfo } from '$ts/constants/social';
</script>

<div class="w-full flex flex-wrap justify-center items-stretch px-6 py-6 gap-3">
	<SocialBar isInline withBlog withEmail />
	<div class="py-1.5 self-stretch hidden md:flex">
		<div class="w-2px h-full rounded-full bg-c-on-bg/8" />
	</div>
	<p
		class="w-full md:w-auto text-center md:text-left flex items-center leading-relaxed
		justify-center text-xs text-c-on-bg/50 font-semibold py-1 px-2.5"
	>
		{companyInfo}
	</p>
</div>
