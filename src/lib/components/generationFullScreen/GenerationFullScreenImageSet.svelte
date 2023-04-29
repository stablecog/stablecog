<script lang="ts">
	export let onImageLoad: (e: Event) => void;
	export let upscaleBeingProcessed: boolean;
	export let backgroundImageUrl: string;
	export let backgroundImageWidth: number;
	export let backgroundImageHeight: number;
	export let imageUrl: string;
	export let imageWidth: number;
	export let imageHeight: number;
	export let prompt: string;
</script>

<img
	style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
	class="{upscaleBeingProcessed
		? 'blur-xl translate-3d-0'
		: ''} w-full transform transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
	src={backgroundImageUrl}
	alt="Blurred background 2 for: {prompt}"
	width={backgroundImageWidth}
	height={backgroundImageHeight}
/>
<img
	on:load={onImageLoad}
	style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
	class="{upscaleBeingProcessed
		? 'blur-xl translate-3d-0'
		: ''} filter w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
	src={imageUrl}
	alt={prompt}
	width={imageWidth}
	height={imageHeight}
/>
