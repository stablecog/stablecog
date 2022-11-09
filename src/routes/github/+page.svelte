<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.github}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: 'Github' })}
	title="GitHub | Stablecog"
	description="Check out the Stablecog repo on Github."
/>
