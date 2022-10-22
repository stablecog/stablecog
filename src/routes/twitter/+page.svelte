<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.twitter}
	redirectingText="Redirecting to Twitter"
	title="Twitter | Stablecog"
	description="Follow us on Twitter for updates on Stablecog."
/>
