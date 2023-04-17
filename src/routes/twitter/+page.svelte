<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.twitter}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: 'Twitter' })}
	title="Twitter | Synthica"
	description="Follow us on Twitter for updates on Synthica."
/>
