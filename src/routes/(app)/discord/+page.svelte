<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.discord}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.Discord() })}
	title="Discord | Stablecog"
	description="Join our Discord server to get updates on Stablecog, share your generations, and more!"
/>
