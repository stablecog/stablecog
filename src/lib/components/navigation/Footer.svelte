<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import { companyInfo } from '$ts/constants/social';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 py-5 gap-1.5 md:gap-2.5">
	<SocialBar isInline withBlog withEmail />
	<div class="w-full md:w-auto flex justify-center items-center">
		<p
			class="text-center leading-relaxed text-xs text-c-on-bg/50 
			font-semibold py-1 -mt-1 md:my-auto rounded-lg"
		>
			{companyInfo}
		</p>
	</div>
</div>
