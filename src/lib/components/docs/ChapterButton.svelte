<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { docContainerSize } from '$components/docs/constants';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TSidebarItem } from '$docroutes/guide/types';
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import MethodBadge from '$components/docs/MethodBadge.svelte';

	export let item: TSidebarItem;
	export { classes as class };
	let classes = '';

	$: src = item.preview_image_url ? getImgProxySrcDefault(item.preview_image_url) : undefined;
	$: srcset = item.preview_image_url
		? getImgProxySrcSet({ src: item.preview_image_url })
		: undefined;
	const sizes = item.preview_image_url
		? `(min-width: 768px) ${docContainerSize / 2}px, 100vw`
		: undefined;
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
					class="max-w-full font-normal overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-c-on-bg/60"
				>
					{$LL.Guide.ChapterTitle()}
				</p>
				<div class="flex items-center gap-2.5 pr-1">
					<h3
						class="inline flex-shrink min-w-0 text-lg font-semibold
						text-c-on-bg transition not-touch:group-hover:text-c-primary"
					>
						{item.title}
					</h3>
					{#if item.http_method}
						<MethodBadge size="sm" method={item.http_method} />
					{/if}
				</div>
			</div>
			<IconArrowRight
				class="w-5 h-5 text-c-on-bg/50 transition not-touch:group-hover:translate-x-1.5 
				not-touch:group-hover:text-c-primary"
			/>
		</div>
		{#if src && srcset && sizes}
			<img
				loading="lazy"
				width="1200"
				height="630"
				class="w-full h-auto rounded-lg mt-3 bg-c-bg-secondary border-2 border-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
				{sizes}
				{src}
				{srcset}
				alt={item.title}
			/>
		{/if}
	</div>
</a>
