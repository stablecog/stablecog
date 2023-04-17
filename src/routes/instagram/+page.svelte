<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialUrls } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialUrls.instagram}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: 'Instagram' })}
	title="Instagram | Synthica"
	description="Follow us on Instagram for updates on Synthica, to see generations made with Synthica, and more..."
/>
