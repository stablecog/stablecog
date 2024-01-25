<script lang="ts">
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto text-center">
			<IconHourglass class="w-28 h-28" />
			<p class="text-3xl font-bold mt-3">{$LL.Error.LinkExpired.TitleAlt()}</p>
			<p class="text-c-on-bg/60 mt-3 w-full max-w-xs leading-relaxed pb-[5vh]">
				{$LL.Error.LinkExpired.Paragraph()}
			</p>
	</div>
</PageWrapper>
