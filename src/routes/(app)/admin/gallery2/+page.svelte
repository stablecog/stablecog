<script lang="ts">
	export let data;
</script>

<div class="w-full flex flex-col">
	{#if data.generationOutputs}
		<div class="w-full flex flex-wrap">
			{#each data.generationOutputs as item}
				<div class="w-1/4 relative">
					<img class="w-full relative" src="https://b.stablecog.com/{item.image_path}" alt="asdf" />
					<div class="bg-c-bg/50 flex flex-col absolute bottom-0 left-0">
						<p class="px-2 py-1 text-sm">Model ID: {item.generations.model_id}</p>
						<p class="px-2 py-1 text-sm">Generation ID: {item.generations.id}</p>
						<p class="px-2 py-1 text-sm">Width: {item.generations.width}</p>
						<p class="px-2 py-1 text-sm">Height: {item.generations.height}</p>
						<p class="px-2 py-1 text-sm">Prompt: {item.generations.prompts.text}</p>
						<p class="px-2 py-1 text-sm">
							Negative Prompt: {item.generations.negative_prompts.text}
						</p>
						<p class="px-2 py-1 text-sm">
							Scale: {item.generations.guidance_scale}
						</p>
						<p class="px-2 py-1 text-sm">
							Steps: {item.generations.inference_steps}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
