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

<div style="min-height: 100vh; min-height: 100svh" class="w-full flex items-stretch relative">
	<Sidebar class="w-64 lg:w-72 hidden md:flex" sidebar={guideSidebar} />
	<div class="flex-1 overflow-hidden">
		<slot />
	</div>
	<div class="w-64 lg:w-72 hidden xl:block" />
</div>

<Drawer hasCustomContent>
	<div
		slot="header"
		class="w-full flex justify-between items-stretch border-b-2 border-c-bg-secondary gap-2 z-10"
	>
		<h3
			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis px-4.5 text-2xl font-bold pt-[calc(0.75rem+2px)] pb-3 z-10"
		>
			{$LL.Guide.PageTitle()}
		</h3>
		<a
			href="/generate"
			on:click={closeDrawer}
			data-sveltekit-preload-data="hover"
			class="flex-shrink-0 px-5 py-4 flex items-center justify-center group overflow-hidden relative z-0 gap-2"
		>
			<ButtonHoverEffect size="md" noRounding noPadding hoverFrom="right" />
			<IconHome class="text-c-on-bg/40 w-5 h-5 transition group-hover:text-c-primary" />
			<p class="text-c-on-bg/40 font-semibold transition text-sm group-hover:text-c-primary">
				{$LL.Shared.GoHomeButton()}
			</p>
		</a>
	</div>
	<Sidebar class="w-full" sidebar={guideSidebar} noDivider />
</Drawer>
