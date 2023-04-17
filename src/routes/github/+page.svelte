<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.github}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: 'Github' })}
	title="GitHub | Synthica"
	description="Check out the Synthica repo on Github."
/>
