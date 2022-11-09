<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.producthunt}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: 'Product Hunt' })}
	title="Product Hunt | Stablecog"
	description="Follow Stablecog on Product Hunt to get the latest updates on the app."
/>
