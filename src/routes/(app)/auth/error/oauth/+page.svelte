<script>
	import IconLinkBroken from "$components/icons/IconLinkBroken.svelte";
	import LL from "$i18n/i18n-svelte";
	import ErrorPage from "../ErrorPage.svelte";
</script>

<ErrorPage title={$LL.Error.OAuthFailed.Title()} paragraph={$LL.Error.OAuthFailed.Paragraph()} icon={IconLinkBroken}/>