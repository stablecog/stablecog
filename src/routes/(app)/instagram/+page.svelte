<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.instagram}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.Instagram() })}
	title="Instagram | Stablecog"
	description="Follow us on Instagram for updates on Stablecog, to see generations made with Stablecogs, and more..."
/>
