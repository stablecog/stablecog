<script>
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import LL from '$i18n/i18n-svelte';
	import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage
	metaTitle="Link Expired | Stablecog"
	report={{
		subject: `Sign in problem using magic link`,
		body: `I'm having a problem signing in using the magic link.`
	}}
	title={$LL.Error.LinkExpired.TitleAlt()}
	paragraph={$LL.Error.LinkExpired.Paragraph()}
	icon={IconHourglass}
/>
