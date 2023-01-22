<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import { companyInfo } from '$ts/constants/social';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 py-5 gap-1.5 md:gap-2.5">
	<SocialBar isInline withBlog withEmail />
	<div class="w-full md:w-auto flex justify-center items-center">
		<p
			class="text-center leading-relaxed text-xs text-c-on-bg/50 
			font-semibold py-1.5 px-3 bg-c-bg rounded-lg border-2 border-c-bg-secondary"
		>
			{companyInfo}
		</p>
	</div>
</div>
