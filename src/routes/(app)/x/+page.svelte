<script lang="ts">
	import RedirectPage from '$components/RedirectPage.svelte';
	import LL from '$i18n/i18n-svelte';
	import { socialAppUrlsAbsolute } from '$ts/constants/social';
</script>

<RedirectPage
	url={socialAppUrlsAbsolute.x}
	redirectingText={$LL.Redirect.RedirectingToTitle({ name: $LL.Platform.X() })}
	title="X | Stablecog"
	description="Follow us on X for updates on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
/>
