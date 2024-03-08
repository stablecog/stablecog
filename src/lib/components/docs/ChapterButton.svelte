<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
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
	class="group group relative flex w-full flex-1 flex-col items-center
  justify-between overflow-hidden rounded-xl bg-c-bg p-3 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-secondary {classes}"
>
	<ButtonHoverEffect noPadding color="bg-secondary" hoverFrom="left" />
	<div class="relative flex w-full flex-1 flex-col">
		<div class="item-center flex w-full flex-1 flex-row items-center gap-4 px-1">
			<div class="max-w-full flex-1 flex-col overflow-hidden">
				<p
					class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-normal text-c-on-bg/60"
				>
					{item.http_method ? $LL.Guide.EndpointTitle() : $LL.Guide.ChapterTitle()}
				</p>
				<div class="flex items-center gap-2.5 pr-1">
					<h3
						class="inline min-w-0 flex-shrink text-lg font-semibold
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
				class="h-5 w-5 text-c-on-bg/50 transition not-touch:group-hover:translate-x-1.5 
				not-touch:group-hover:text-c-primary"
			/>
		</div>
		{#if src && srcset && sizes}
			{#key src}
				<img
					loading="lazy"
					width="1200"
					height="630"
					class="mt-3 h-auto w-full rounded-lg border-2 border-c-bg-secondary bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
					{sizes}
					{src}
					{srcset}
					alt={item.title}
				/>
			{/key}
		{/if}
	</div>
</a>
