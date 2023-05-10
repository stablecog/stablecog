<script lang="ts">
	export let onImageLoad: (e: Event) => void;
	export let backgroundImageUrl: string;
	export let backgroundImageWidth: number;
	export let backgroundImageHeight: number;
	export let imageUrl: string;
	export let imageWidth: number;
	export let imageHeight: number;
	export let prompt: string;
</script>

<img
	class="w-full transform transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
	src={backgroundImageUrl}
	alt="Blurred background 2 for: {prompt}"
	width={backgroundImageWidth}
	height={backgroundImageHeight}
/>
<img
	on:load={onImageLoad}
	class="w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
	src={imageUrl}
	alt={prompt}
	width={imageWidth}
	height={imageHeight}
/>
