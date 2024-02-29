<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.producthunt}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.ProductHunt() })}
	title="Product Hunt | Stablecog"
	description="Follow Stablecog on Product Hunt to get the latest updates on the app."
/>
