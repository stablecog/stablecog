<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.producthunt}
	redirectingText="Redirecting to Product Hunt"
	title="Product Hunt | Stablecog"
	description="Follow Stablecog on Product Hunt to get the latest updates on the app."
/>
