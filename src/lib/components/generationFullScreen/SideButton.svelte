<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
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
	class="group z-10 max-h-full touch-manipulation rounded-xl p-0.5 md:p-1 {classes}"
>
	<div class={wrapperClass}>
		{#if onClick}
			<ButtonHoverEffect hoverFrom={side === 'left' ? 'right' : 'left'} />
		{/if}
		<div class="flex max-w-full flex-col items-center">
			{#if count !== undefined}
				<div
					class="relative z-0 -mt-18 flex h-12 w-12 items-center justify-center overflow-hidden
					rounded-md bg-c-bg-tertiary shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)] ring-1.5 {isGenerationSelected
						? 'ring-c-primary'
						: 'ring-c-bg-tertiary'}"
				>
					{#if generation !== undefined}
						{#key generation.id}
							<img
								src={getImgProxySrc({
									src: generation.selected_output.image_url,
									preset: '128w'
								})}
								width={generation.width}
								height={generation.height}
								alt={generation.prompt.text}
								class="h-full w-full object-cover"
							/>
						{/key}
					{/if}
				</div>
				<p
					class="relative z-[1] max-w-full transition duration-100 {onClick
						? 'not-touch:group-hover:text-c-primary'
						: ''} mb-2 mt-2 overflow-hidden
						overflow-ellipsis px-3 py-1 text-center text-xs font-semibold group-disabled:opacity-15"
				>
					{count}
				</p>
			{/if}
			<IconChevronDown
				strokeWidth={3}
				class="{iconClass} transform text-c-on-bg transition duration-100 {isRecentlyClicked &&
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
