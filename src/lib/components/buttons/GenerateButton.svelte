<script lang="ts">
	import IconWand from '$components/icons/IconWand.svelte';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	export let generation: TGenerationWithSelectedOutput;
	export { classes as class };
	let classes = '';

	let element: HTMLAnchorElement;
</script>

<a
	bind:this={element}
	on:click={() => {
		element.blur();
	}}
	data-sveltekit-prefetch
	class="transition rounded-lg group-1 {classes}"
	href={getGenerationUrlFromParams({
		prompt: generation.prompt,
		negative_prompt: generation.negative_prompt ?? undefined,
		model_id: generation.model_id ?? undefined,
		scheduler_id: generation.scheduler_id ?? undefined,
		num_inference_steps: generation.inference_steps ?? undefined,
		guidance_scale: generation.guidance_scale ?? undefined,
		width: generation.width,
		height: generation.height
	})}
>
	<div class="p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-full 
			bg-c-primary absolute left-0 top-0 group-1-focus:translate-x-0 {!$isTouchscreen
				? 'group-1-hover:translate-x-0'
				: ''}"
		/>
		<IconWand
			class="w-7 h-7 transition text-c-on-bg relative group-1-focus:text-c-on-primary {!$isTouchscreen
				? 'group-1-hover:text-c-on-primary'
				: ''}"
		/>
		<p class="hidden">Generate</p>
	</div>
</a>
