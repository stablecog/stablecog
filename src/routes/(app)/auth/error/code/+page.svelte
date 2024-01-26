<script>
	import IconHourglass from "$components/icons/IconHourglass.svelte";
	import LL from "$i18n/i18n-svelte";
	import ErrorPage from "../ErrorPage.svelte";
</script>

<ErrorPage title={$LL.Error.LinkExpired.TitleAlt()} paragraph={$LL.Error.LinkExpired.Paragraph()} icon={IconHourglass}/>