<script>
	import LL from '$i18n/i18n-svelte';
	import Logo from '../Logo.svelte';
	import ScBar from '../ScBar.svelte';
</script>

<div class="flex w-full flex-1 justify-center px-3 py-12">
	<div class="my-auto">
		<div
			class="my-auto flex w-full max-w-sm flex-col items-center rounded-2xl bg-c-bg px-5 py-6
      text-center shadow-xl shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-secondary md:max-w-md md:px-8 md:py-8"
		>
			<Logo class="w-16 md:w-18" />
			<p class="mt-5 text-2xl font-bold">{$LL.UnderDevelopment.PageTitle()}</p>
			<p class="mt-2 text-c-on-bg/60">
				{$LL.UnderDevelopment.PageParagraph()}
			</p>
			<ScBar isInline withAbsoluteUrls noGuide noBlog class="mt-2" />
		</div>
		<div class="h-[2vh]" />
	</div>
</div>
