<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import { getImgProxySrc } from '$ts/helpers/imgproxy';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	export let element: HTMLButtonElement;
	export let name: string;
	export let onClick: (() => void) | undefined;
	export let side: 'left' | 'right' = 'left';
	export let iconClass = 'w-8 h-8';
	export let wrapperClass = 'w-full h-full relative flex items-center rounded-xl justify-center';
	export let hasAnimation = true;
	export let generation: TGenerationWithSelectedOutput | undefined = undefined;
	export let isGenerationSelected: boolean | undefined = undefined;
	export let count: number | undefined = undefined;
	export { classes as class };
	let classes = `absolute ${
		side === 'left' ? 'left-0' : 'right-0'
	} w-18 flex items-center justify-center top-1/2 transform -translate-y-1/2 h-64`;

	let isRecentlyClicked = false;
	let isRecentlyClickedTimeout: NodeJS.Timeout;

	function _onClick() {
		if (!onClick) return;
		isRecentlyClicked = true;
		clearTimeout(isRecentlyClickedTimeout);
		isRecentlyClickedTimeout = setTimeout(() => {
			isRecentlyClicked = false;
		}, 100);
		onClick();
	}
</script>

<button
	aria-label={name}
	bind:this={element}
	on:click={_onClick}
	disabled={onClick === undefined}
	class="z-10 group p-0.5 md:p-1 rounded-xl touch-manipulation max-h-full {classes}"
>
	<div class={wrapperClass}>
		{#if onClick}
			<ButtonHoverEffect hoverFrom={side === 'left' ? 'right' : 'left'} />
		{/if}
		<div class="max-w-full flex flex-col items-center">
			{#if count !== undefined}
				<div
					class="w-12 h-12 overflow-hidden flex items-center justify-center z-0 relative -mt-18
					rounded-md bg-c-bg-tertiary ring-1.5 shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] {isGenerationSelected
						? 'ring-c-primary'
						: 'ring-c-bg-tertiary'}"
				>
					{#if generation !== undefined}
						<img
							src={getImgProxySrc({
								src: generation.selected_output.image_url,
								preset: '128w'
							})}
							width={generation.width}
							height={generation.height}
							alt={generation.prompt.text}
							class="w-full h-full object-cover"
						/>
					{/if}
				</div>
				<p
					class="max-w-full transition duration-100 relative z-[1] {onClick
						? 'not-touch:group-hover:text-c-primary'
						: ''} group-disabled:opacity-15 overflow-hidden overflow-ellipsis
						text-center text-xs font-semibold py-1 mt-2 mb-2 px-3"
				>
					{count}
				</p>
			{/if}
			<IconChevronDown
				strokeWidth={3}
				class="{iconClass} text-c-on-bg transition duration-100 transform {isRecentlyClicked &&
				hasAnimation
					? side === 'left'
						? '-translate-x-1.5'
						: 'translate-x-1.5'
					: ''} {side === 'left' ? 'rotate-90' : '-rotate-90'} {onClick
					? 'not-touch:group-hover:text-c-primary'
					: ''} group-disabled:opacity-15"
			/>
		</div>
	</div>
</button>
