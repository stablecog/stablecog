<script lang="ts">
	import { onMount } from 'svelte';

	let loaded = false;
	onMount(async () => {
		const player = (await import('@lottiefiles/lottie-player')).default;
		loaded = true;
	});
</script>

<div
	class="overflow-hidden w-full h-full flex justify-end items-end transition duration-500 ease-in {loaded
		? 'opacity-100'
		: 'opacity-0'}"
>
	<div
		style="background-image: url('/landing/hero.jpeg');"
		class="w-full h-full absolute right-0 top-0 bg-cover bg-center"
	/>
	<lottie-player
		autoplay
		loop
		speed="1"
		mode="normal"
		src="/landing/hero.json"
		preserveAspectRatio="xMinYMax slice"
		class="w-full h-full scale-101 absolute left-0 bottom-0 bg-cover bg-center overflow-hidden"
	/>
</div>
