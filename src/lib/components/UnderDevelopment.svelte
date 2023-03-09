<script>
	import LL from '$i18n/i18n-svelte';
	import Logo from './Logo.svelte';
	import SocialBar from './SocialBar.svelte';
</script>

<div class="w-full flex-1 flex justify-center px-3 py-12">
	<div class="my-auto">
		<div
			class="w-full max-w-sm md:max-w-md my-auto flex flex-col items-center text-center bg-c-bg rounded-2xl
      ring-2 ring-c-bg-secondary px-5 py-6 md:px-8 md:py-9 shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<Logo class="w-16 md:w-18" />
			<p class="font-bold text-2xl mt-5">{$LL.UnderDevelopment.PageTitle()}</p>
			<p class="text-c-on-bg/60 mt-2">
				{$LL.UnderDevelopment.PageParagraph()}
			</p>
			<SocialBar isInline withEmail withAbsoluteUrls class="mt-2" />
		</div>
		<div class="h-[2vh]" />
	</div>
</div>
