<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import Sidebar from '$components/docs/Sidebar.svelte';
	import IconHome from '$components/icons/IconHome.svelte';
	import Drawer from '$components/navigation/Drawer.svelte';
	import LL from '$i18n/i18n-svelte';
	import { trySidebar } from '$routes/(doc)/try/constants';
</script>

<div style="min-height: 100vh; min-height: 100svh" class="w-full flex items-stretch relative">
	<Sidebar class="w-64 lg:w-72 hidden md:flex" sidebar={trySidebar} />
	<div class="flex-1 overflow-hidden">
		<slot />
	</div>
	<div class="w-64 lg:w-72 hidden xl:block" />
</div>

<Drawer hasCustomContent>
	<div
		class="w-full flex justify-between items-stretch border-b-2 border-c-bg-secondary
		sticky transform -translate-y-2px top-0 bg-c-bg gap-2 z-10"
	>
		<h3
			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis px-4.5 text-2xl font-bold pt-[calc(0.75rem+2px)] pb-3 z-10"
		>
			{$LL.Try.PageTitle()}
		</h3>
		<a
			href="/generate"
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
	<Sidebar noBottomPadding class="w-full" sidebar={trySidebar} />
</Drawer>
