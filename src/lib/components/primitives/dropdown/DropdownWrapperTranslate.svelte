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
		? { callback: onClickoutside, exclude: excludeFromClickoutside }
		: undefined}
	in:flyAndScale={{
		duration: 200,
		yRem: translate === 'sm' ? -0.75 : translate === 'md' ? -1 : -1.5,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	out:flyAndScale={{
		duration: 125,
		yRem: translate === 'sm' ? -0.4 : -1,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	class="transition-all ring-2 ring-c-bg-tertiary bg-c-bg-secondary {rounding} flex flex-col justify-start shadow-xl shadow-c-shadow/[var(--o-shadow-strongest)]
		absolute {alignment} overflow-hidden z-50 {classes}"
>
	<div class="w-full flex flex-col justify-start z-0 overflow-hidden relative">
		<slot />
	</div>
</div>
