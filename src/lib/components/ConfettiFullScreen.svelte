<script lang="ts">
	import { portal } from 'svelte-portal';
	import { Confetti } from 'svelte-confetti';
	import { theme } from '$ts/stores/theme';

	$: confettiColorArray =
		$theme === 'light'
			? ['rgb(96,42,204)', 'rgb(210,108,34)', 'rgb(12,150,0)']
			: ['rgb(174,133,235)', 'rgb(255,174,116)', 'rgb(129,209,116)'];
</script>

<div
	use:portal={'body'}
	class="fixed -bottom-16 left-0 h-[calc(100vh+4rem)] w-screen flex justify-center items-end overflow-hidden pointer-events-none"
>
	<Confetti
		y={[0, 10]}
		x={[-4, 4]}
		colorArray={confettiColorArray}
		duration={6000}
		delay={[0, 1000]}
		amount="400"
		fallDistance="100vh"
	/>
</div>
