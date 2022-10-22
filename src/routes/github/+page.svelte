<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.github}
	redirectingText="Redirecting to GitHub"
	title="GitHub | Stablecog"
	description="Check out the Stablecog repo on Github."
/>
