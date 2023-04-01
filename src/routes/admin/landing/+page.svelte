<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import Hero from './Hero.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		const player = (await import('@lottiefiles/lottie-player')).default;
	});
</script>

<div class="w-full flex flex-col flex-1">
	<div
		class="w-full min-h-[calc(100vh-8rem)] min-h-[calc(100svh-8rem)] md:min-h-[calc(100vh-6rem)] md:min-h-[calc(100svh-6rem)]
		lg:min-h-0 flex-1 flex flex-col lg:flex-row justify-between items-center my-auto"
	>
		<div
			class="px-8 lg:pl-[max(calc((100%-1280px)/2),4rem)] flex flex-col order-1 lg:order-0 items-center lg:items-start gap-6 
			pb-24 md:pb-18 lg:pt-12 lg:pb-48"
		>
			<h1
				class="max-w-md text-center lg:text-left leading-tight lg:leading-tight text-3xl lg:text-4.5xl font-bold"
			>
				Create amazing art in seconds with AI
			</h1>
			<Button>
				<p class="px-4">Get Started</p>
			</Button>
		</div>
		<div
			class="w-full flex-1 lg:h-[calc(100vh+2rem)] lg:w-1/2 relative overflow-hidden -mt-24 order-0 lg:order-1"
		>
			<Hero />
		</div>
	</div>
</div>
