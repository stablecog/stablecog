<script lang="ts">
	import ScBar from '$components/ScBar.svelte';
	import LL from '$i18n/i18n-svelte';
	import { companyInfo } from '$ts/constants/social';

	export { classes as class };
	export let noBlog = true;
	export let noGuide = true;
	let classes = 'px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]';
</script>

<div class="flex w-full flex-wrap items-center justify-center gap-1.5 md:gap-2.5 {classes}">
	<ScBar isInline {noBlog} {noGuide} />
	<div class="flex w-full flex-col flex-wrap items-start md:w-auto">
		<div class="flex w-full flex-row items-center justify-center gap-1.5 md:w-auto">
			<a
				href="/terms"
				data-sveltekit-preload-data="hover"
				class="rounded-lg py-0.5 text-center text-xs font-medium leading-relaxed
				text-c-on-bg/60 hover:text-c-primary hover:underline md:my-auto"
				>{$LL.Legal.TermsOfServiceTitle()}</a
			>
			<span class="text-xs text-c-on-bg/25">•</span>
			<a
				href="/privacy"
				data-sveltekit-preload-data="hover"
				class="rounded-lg py-0.5 text-center text-xs font-medium leading-relaxed text-c-on-bg/60
				transition hover:text-c-primary hover:underline md:my-auto">{$LL.Legal.PrivacyPolicyTitle()}</a
			>
		</div>
		<div class="mt-0.5 flex w-full items-center justify-center md:mt-0 md:w-auto">
			<p
				class="rounded-lg text-center text-xs font-medium
				leading-relaxed text-c-on-bg/60"
			>
				{companyInfo}
			</p>
		</div>
	</div>
</div>
