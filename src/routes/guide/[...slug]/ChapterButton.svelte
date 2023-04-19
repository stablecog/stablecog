<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TSidebarItem } from '$routes/guide/types';

	export let item: TSidebarItem;
	export { classes as class };
	let classes = '';
</script>

<a
	data-sveltekit-preload-data="hover"
	href={item.pathname}
	class="flex-1 flex flex-col w-full overflow-hidden group justify-between items-center 
  rounded-xl ring-2 p-3 ring-c-bg-secondary group relative bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {classes}"
>
	<ButtonHoverEffect noPadding color="bg-secondary" hoverFrom="left" />
	<div class="w-full flex-1 flex flex-col relative">
		<div class="w-full px-1 flex-1 flex flex-row item-center gap-4 items-center">
			<div class="flex-1 max-w-full flex-col overflow-hidden">
				<p
					class="max-w-full font-normal overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-c-on-bg/50"
				>
					{$LL.Guide.ChapterTitle()}
				</p>
				<h3
					class="max-w-full text-lg font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap text-c-on-bg transition group-hover:text-c-primary"
				>
					{item.title}
				</h3>
			</div>
			<IconArrowRight
				class="w-5 h-5 text-c-on-bg/50 transition group-hover:translate-x-1.5 group-hover:text-c-primary"
			/>
		</div>
		<img
			width="1200"
			height="630"
			class="w-full h-auto rounded-lg mt-3 bg-c-bg-secondary border-2 border-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
			src={item.preview_image_url}
			alt={item.title}
		/>
	</div>
</a>
