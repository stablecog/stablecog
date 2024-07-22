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
		},
		{
			title: $LL.Admin.LogsTab(),
			href: '/admin/logs',
			show: isSuperAdmin($userSummary?.roles || []),
			icon: 'logs'
		}
	];
</script>

<MetaTag
	title="Admin | Stablecog"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews/home-{previewImageVersion}.png"
/>

<div class="flex w-full flex-1 justify-center px-5 py-6 pb-[calc(3vh)] md:py-8">
	<div class="my-auto flex w-full max-w-7xl flex-row flex-wrap items-center justify-center gap-4">
		{#each adminRoutes.filter((r) => r.show !== false) as route}
			<a
				href={route.href}
				data-sveltekit-preload-data="hover"
				class="group relative z-0 flex w-full max-w-md flex-col items-center gap-2 self-stretch overflow-hidden rounded-xl bg-c-bg-secondary
					p-5 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-tertiary transition not-touch:hover:-translate-y-1.5 not-touch:hover:shadow-xl
					not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:ring-4
					md:max-w-xs md:p-6"
			>
				<IconNavbarRoute
					class="-mt-0.5 h-14 w-14 transition not-touch:group-hover:text-c-primary"
					type={route.icon}
				/>
				<p
					class="max-w-full text-center text-lg font-bold leading-snug text-c-on-bg transition
					not-touch:group-hover:text-c-primary"
				>
					{route.title}
				</p>
			</a>
		{/each}
	</div>
</div>
