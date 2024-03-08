<script lang="ts">
	import '$css/blog.css';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import Drawer from '$components/navigation/Drawer.svelte';
	import LL from '$i18n/i18n-svelte';
	import Sidebar from '$components/docs/Sidebar.svelte';
	import { guideSidebar } from '$docroutes/guide/constants';
	import { closeDrawer } from '$ts/stores/isDrawerOpen';
</script>

<div style="min-height: 100vh; min-height: 100svh" class="relative flex w-full items-stretch">
	<Sidebar class="hidden w-64 md:flex lg:w-72" sidebar={guideSidebar} />
	<div class="flex-1 overflow-hidden">
		<slot />
	</div>
	<div class="hidden w-64 lg:w-72 xl:block" />
</div>

<Drawer hasCustomContent>
	<div
		slot="header"
		class="z-10 flex w-full items-stretch justify-between gap-2 border-b-2 border-c-bg-secondary"
	>
		<h3
			class="z-10 min-w-0 flex-1 overflow-hidden overflow-ellipsis px-4.5 pb-3 pt-[calc(0.75rem+2px)] text-2xl font-bold"
		>
			{$LL.Guide.PageTitle()}
		</h3>
		<a
			href="/generate"
			on:click={closeDrawer}
			data-sveltekit-preload-data="hover"
			class="group relative z-0 flex flex-shrink-0 items-center justify-center gap-2 overflow-hidden px-5 py-4"
		>
			<ButtonHoverEffect size="md" noRounding noPadding hoverFrom="right" />
			<IconHome class="h-5 w-5 text-c-on-bg/50 transition group-hover:text-c-primary" />
			<p class="text-sm font-semibold text-c-on-bg/50 transition group-hover:text-c-primary">
				{$LL.Shared.GoHomeButton()}
			</p>
		</a>
	</div>
	<Sidebar class="w-full" sidebar={guideSidebar} noDivider />
</Drawer>
