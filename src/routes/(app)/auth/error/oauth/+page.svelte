<script>
	import IconLinkBroken from '$components/icons/IconLinkBroken.svelte';
	import LL from '$i18n/i18n-svelte';
	import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage
	report={{
		subject: `Sign in problem using OAuth`,
		body: `I'm having a problem signing in using OAuth.`
	}}
	title={$LL.Error.OAuthFailed.Title()}
	paragraph={$LL.Error.OAuthFailed.Paragraph()}
	icon={IconLinkBroken}
/>
