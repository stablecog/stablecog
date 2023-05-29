<script lang="ts">
	import ScBar from '$components/ScBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import { companyInfo } from '$ts/constants/social';

	export { classes as class };
	export let withBlog = true;
	export let withEmail = true;
	export let withGuide = true;
	let classes = 'px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]';
</script>

<div class="w-full flex flex-wrap justify-center items-center gap-1.5 md:gap-2.5 {classes}">
	<ScBar isInline {withBlog} {withEmail} {withGuide} />
	<div class="w-full md:w-auto flex flex-col flex-wrap items-start -mt-0.5 md:-mt-1">
		<div class="w-full md:w-auto flex flex-row justify-center items-center gap-1.5">
			<a
				href="/terms"
				data-sveltekit-preload-data="hover"
				class="text-center hover:underline hover:text-c-primary leading-relaxed text-xs text-c-on-bg/60
				font-medium md:my-auto rounded-lg">{$LL.Legal.TermsOfServiceTitle()}</a
			>
			<span class="text-c-on-bg/25">•</span>
			<a
				href="/privacy"
				data-sveltekit-preload-data="hover"
				class="text-center hover:underline hover:text-c-primary transition leading-relaxed text-xs text-c-on-bg/60
				font-medium md:my-auto rounded-lg">{$LL.Legal.PrivacyPolicyTitle()}</a
			>
		</div>
		<div class="w-full md:w-auto flex justify-center items-center mt-0.5 md:mt-0">
			<p
				class="text-center leading-relaxed text-xs text-c-on-bg/60
				font-medium rounded-lg"
			>
				{companyInfo}
			</p>
		</div>
	</div>
</div>
