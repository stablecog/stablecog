<script lang="ts">
	export let label: string;
	export let text: string;
	export let portalContainer: HTMLElement | undefined = undefined;
	export { classes as class };
	let classes = '';

	import { Tooltip } from 'radix-svelte';

	const contentSide = 'bottom';
	const contentAlign = 'center';
	const sideOffset = -4;
	const collisionPadding = 8;

	let isRootOpen = false;
</script>

<Tooltip.Root bind:open={isRootOpen} class={classes} disableHoverableContent={true}>
	<Tooltip.Trigger aria-label={label}>
		<slot />
	</Tooltip.Trigger>
	<Tooltip.Portal container={portalContainer || 'body'}>
		<Tooltip.Content
			side={contentSide}
			{sideOffset}
			align={contentAlign}
			{collisionPadding}
			avoidCollisions={true}
			hideWhenDetached={false}
			class="group pointer-events-none select-none rounded-md bg-c-bg-secondary px-2.5 py-1.25 text-xs
        font-semibold shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] will-change-[transform,opacity] data-[state=delayed-open]:animate-slide-up-and-fade"
		>
			<p
				class="will-change-[transform,opacity] group-data-[state=delayed-open]:animate-slide-up-and-fade"
			>
				{text}
			</p>
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
