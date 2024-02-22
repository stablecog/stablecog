<script lang="ts">
	import ScBar from '$components/ScBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import { companyInfo } from '$ts/constants/social';

	export { classes as class };
	export let noBlog = false;
	export let noEmail = false;
	export let noGuide = false;
	let classes = 'px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]';
</script>

<div class="w-full flex flex-wrap justify-center items-center gap-1.5 md:gap-2.5 {classes}">
	<ScBar isInline {noBlog} {noEmail} {noGuide} />
	<div class="w-full md:w-auto flex flex-col flex-wrap items-start">
		<div class="w-full md:w-auto flex flex-row justify-center items-center gap-1.5">
			<a
				href="/terms"
				data-sveltekit-preload-data="hover"
				class="text-center hover:underline hover:text-c-primary leading-relaxed text-xs text-c-on-bg/60
				font-medium md:my-auto rounded-lg py-0.5">{$LL.Legal.TermsOfServiceTitle()}</a
			>
			<span class="text-c-on-bg/25 text-xs">•</span>
			<a
				href="/privacy"
				data-sveltekit-preload-data="hover"
				class="text-center hover:underline hover:text-c-primary transition leading-relaxed text-xs text-c-on-bg/60
				font-medium md:my-auto rounded-lg py-0.5">{$LL.Legal.PrivacyPolicyTitle()}</a
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
