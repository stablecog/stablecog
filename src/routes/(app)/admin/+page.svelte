<script lang="ts">
	import IconNavbarRoute from '$components/icons/IconNavbarRoute.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import type { TNavbarRouteOption } from '$components/navigation/routes';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { userSummary } from '$ts/stores/user/summary';

	interface TAdminRoute {
		title: string;
		href: string;
		icon: TNavbarRouteOption;
		show?: boolean;
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
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<div class="w-full flex-1 flex justify-center px-5 py-6 md:py-8 pb-[calc(3vh)]">
	<div class="w-full flex flex-row flex-wrap items-center justify-center gap-4 my-auto max-w-7xl">
		{#each adminRoutes.filter((r) => r.show !== false) as route}
			<a
				href={route.href}
				data-sveltekit-preload-data="hover"
				class="w-full max-w-md md:max-w-xs p-5 md:p-6 gap-2 self-stretch bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative z-0 overflow-hidden
					rounded-xl flex flex-col items-center shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition group
					not-touch:hover:ring-4 not-touch:hover:shadow-xl
					not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:-translate-y-1.5"
			>
				<IconNavbarRoute
					class="w-14 h-14 -mt-0.5 transition not-touch:group-hover:text-c-primary"
					type={route.icon}
				/>
				<p
					class="max-w-full text-center font-bold text-lg leading-snug text-c-on-bg transition
					not-touch:group-hover:text-c-primary"
				>
					{route.title}
				</p>
			</a>
		{/each}
	</div>
</div>
