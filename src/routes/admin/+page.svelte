<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { userSummary } from '$ts/stores/user/summary';
</script>

<MetaTag
	title="Admin | Stablecog"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-5 pb-[calc(3vh)]">
	<div class="my-auto w-full flex flex-col items-center max-w-xl gap-6">
		<h1 class="font-bold text-4xl">{$LL.Admin.AdminPanelTitle()}</h1>
		<div class="w-full flex flex-row flex-wrap items-center justify-center gap-4">
			<Button href="/admin/gallery">{$LL.Admin.AdminGalleryButton()}</Button>
			{#if isSuperAdmin($userSummary?.roles || [])}
				<Button href="/admin/users">{$LL.Admin.UsersButton()}</Button>
			{/if}
		</div>
	</div>
</div>
