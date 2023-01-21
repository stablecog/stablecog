<script lang="ts">
	import SocialBar from '$components/SocialBar.svelte';
	import { companyInfo } from '$ts/constants/social';
</script>

<div class="w-full flex flex-wrap justify-center items-center px-6 py-6 gap-3">
	<SocialBar fullWidth withBlog withEmail />
	<p class="text-xs text-c-on-bg/50 font-semibold -mt-1">{companyInfo}</p>
</div>
