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
	class="touch-manipulation transition group/generatebutton p-2.5 rounded-full bg-c-bg relative overflow-hidden z-0
	before:w-full before:h-full before:absolute before:left-0 before:top-0
	before:-translate-x-full before:not-touch:hover:translate-x-0
	before:rounded-full before:transition before:transform before:bg-c-primary {classes}"
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
		class="w-7 h-7 transform scale-100 transition text-c-on-bg relative
			not-touch:group-hover/generatebutton:text-c-on-primary"
	/>
</a>
