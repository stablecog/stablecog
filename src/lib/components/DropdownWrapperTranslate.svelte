<script lang="ts">
	import { flyAndScale } from '$ts/animation/transitions';
	import { quadOut } from 'svelte/easing';

	export { classes as class };
	export let alignment = 'right-0 top-0';
	export let rounding = 'rounded-xl';
	export let translate: 'sm' | 'md' = 'md';
	let classes = '';
</script>

<div
	in:flyAndScale={{
		duration: 200,
		yRem: translate === 'sm' ? -0.75 : -1.5,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	out:flyAndScale={{
		duration: 150,
		yRem: translate === 'sm' ? -0.4 : -1,
		easing: quadOut,
		transformOrigin: 'right top'
	}}
	class="transition-all ring-2 ring-c-bg-tertiary bg-c-bg-secondary {rounding} flex flex-col justify-start shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
	absolute {alignment} overflow-hidden z-50 {classes}"
>
	<div class="w-full flex flex-col justify-start z-0 overflow-hidden relative">
		<slot />
	</div>
</div>
