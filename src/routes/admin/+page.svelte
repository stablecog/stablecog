<script lang="ts">
	import { page } from '$app/stores';
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { userSummary } from '$ts/stores/user/summary';
	import type { TNavbarRouteOption } from '$ts/types/main';

	interface TAdminRoute {
		title: string;
		href: string;
		icon: TNavbarRouteOption;
	}

	let adminRoutes: TAdminRoute[];
	$: adminRoutes = [
		{
			title: $LL.Admin.AdminGalleryButton(),
			href: '/admin/gallery',
			icon: 'gallery'
		},
		{
			title: $LL.Admin.UsersButton(),
			href: '/admin/users',
			show: isSuperAdmin($userSummary?.roles || []),
			icon: 'users'
		}
	];
</script>

<MetaTag
	title="Admin | Stablecog"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-5 py-6 md:py-8 pb-[calc(3vh)]">
	<div class="w-full flex flex-row flex-wrap items-center justify-center gap-4 my-auto max-w-7xl">
		{#each adminRoutes as route}
			<a
				href={route.href}
				data-sveltekit-preload-data="hover"
				class="w-full max-w-md md:max-w-xs p-5 md:p-6 gap-2 self-stretch bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative z-0 overflow-hidden
					rounded-xl flex flex-col items-center shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition group
					{!$isTouchscreen
					? 'hover:ring-4 hover:shadow-xl hover:shadow-c-shadow/[var(--o-shadow-strong)] hover:-translate-y-1.5'
					: ''}"
			>
				<IconNavbarRoute
					class="w-14 h-14 -mt-0.5 md:-mt-1 transition {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
					type={route.icon}
				/>
				<p
					class="text-center font-bold text-xl leading-snug text-c-on-bg transition {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{route.title}
				</p>
			</a>
		{/each}
	</div>
</div>
