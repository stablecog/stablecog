<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import { companyInfo } from '$ts/constants/social';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 py-5 gap-1.5 md:gap-2.5">
	<SocialBar isInline withBlog withEmail />
	<div class="w-full md:w-auto flex flex-col flex-wrap items-start -mt-1.5 md:-mt-0.5">
		<div class="w-full md:w-auto flex flex-row justify-center items-center gap-1.5">
			<a
				href="/terms"
				class="text-center hover:underline hover:text-c-primary leading-relaxed text-xs text-c-on-bg/50 
				font-semibold md:my-auto rounded-lg">{$LL.Legal.TermsOfServiceTitle()}</a
			>
			<span class="text-c-on-bg/25">•</span>
			<a
				href="/privacy"
				class="text-center hover:underline hover:text-c-primary transition leading-relaxed text-xs text-c-on-bg/50 
				font-semibold md:my-auto rounded-lg">{$LL.Legal.PrivacyPolicyTitle()}</a
			>
		</div>
		<div class="w-full md:w-auto flex justify-center items-center gap-2 mt-1 md:mt-0">
			<p
				class="text-center leading-relaxed text-xs text-c-on-bg/50 
				font-semibold rounded-lg"
			>
				{companyInfo}
			</p>
		</div>
	</div>
</div>
