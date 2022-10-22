<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.instagram}
	redirectingText="Redirecting to Instagram"
	title="Instagram | Stablecog"
	description="Follow us on Instagram for updates on Stablecog, to see generations made with Stablecogs, and more..."
/>
