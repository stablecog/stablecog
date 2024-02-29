<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.twitter}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.Twitter() })}
	title="Twitter | Stablecog"
	description="Follow us on Twitter for updates on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
/>
