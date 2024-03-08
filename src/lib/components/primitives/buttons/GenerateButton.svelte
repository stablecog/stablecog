<script lang="ts">
	import IconWand from '$components/icons/IconWand.svelte';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation';

	export let generation: TGenerationWithSelectedOutput;
	export let label: string;
	export { classes as class };
	let classes = '';

	let element: HTMLAnchorElement;
</script>

<a
	bind:this={element}
	on:click={() => {
		element.blur();
	}}
	data-sveltekit-preload-data="hover"
	class="group/generatebutton relative z-0 touch-manipulation overflow-hidden rounded-full bg-c-bg p-2.5 transition
	before:absolute before:left-0 before:top-0 before:h-full before:w-full
	before:-translate-x-full before:transform
	before:rounded-full before:bg-c-primary before:transition before:not-touch:hover:translate-x-0 {classes}"
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
	aria-label={label}
>
	<IconWand
		class="relative h-7 w-7 scale-100 transform text-c-on-bg transition
			not-touch:group-hover/generatebutton:text-c-on-primary"
	/>
</a>
