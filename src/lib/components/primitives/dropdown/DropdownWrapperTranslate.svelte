<script lang="ts">
	import { clickoutside } from '$ts/actions/clickoutside';
	import { flyAndScale } from '$ts/animation/transitions';
	import type { ContentAction } from 'svelte-floating-ui';
	import { quadOut } from 'svelte/easing';

	export { classes as class };
	export let alignment = 'right-0 top-0';
	export let rounding = 'rounded-xl';
	export let translate: 'sm' | 'md' | 'lg' = 'md';
	export let onClickoutside: (() => void) | undefined = undefined;
	export let excludeFromClickoutside: (HTMLElement | undefined)[] | undefined = undefined;
	export let floatingContent: ContentAction | (() => undefined) = () => undefined;
	let classes = '';
</script>

<div
	use:floatingContent
	use:clickoutside={onClickoutside
		? { callback: onClickoutside, exclude: excludeFromClickoutside, triggerOnBlur: true }
		: undefined}
	in:flyAndScale={{
		duration: 200,
		yRem: translate === 'sm' ? -0.75 : translate === 'md' ? -1 : -1.5,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	out:flyAndScale={{
		duration: 100,
		yRem: translate === 'sm' ? -0.4 : -1,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	class="bg-c-bg-secondary ring-2 ring-c-bg-tertiary transition-all {rounding} absolute flex flex-col justify-start shadow-xl
		shadow-c-shadow/[var(--o-shadow-strongest)] {alignment} z-50 overflow-hidden {classes}"
>
	<div class="relative z-0 flex w-full flex-col justify-start overflow-hidden">
		<slot />
	</div>
</div>
