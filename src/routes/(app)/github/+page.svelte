<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.github}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.GitHub() })}
	title="GitHub | Stablecog"
	description="Check out the Stablecog repo on Github."
/>
