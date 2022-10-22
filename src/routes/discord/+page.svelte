<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.discord}
	redirectingText="Redirecting to Discord"
	title="Discord | Stablecog"
	description="Join our Discord server to get updates on Stablecog, share your generations, and more!"
/>
