<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import type { TGenerationUI } from '$ts/types/main';

	export let generation: TGenerationUI;

	let uploadStatus: 'loading' | 'idle' | 'error' | 'success' = 'idle';

	const upload = async () => {
		console.log('uploading');
		uploadStatus = 'loading';
		let error: unknown;
		try {
			const url = '/admin/api/upload';
			const res = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					imageDataB64: generation.imageDataB64,
					prompt: generation.prompt,
					negative_prompt: generation.negative_prompt,
					seed: String(generation.seed),
					inference_steps: generation.num_inference_steps,
					guidance_scale: generation.guidance_scale
				})
			});
			const resJson = await res.json();
			console.log('Upload res', resJson);
		} catch (e) {
			error = e;
			console.log(e);
		}
		if (error) {
			uploadStatus = 'error';
		} else {
			uploadStatus = 'success';
		}
	};
</script>

{#if uploadStatus !== 'success'}
	<div class="w-full flex">
		<Button
			class="w-full"
			size="sm"
			withSpinner={true}
			loading={uploadStatus === 'loading'}
			onClick={upload}
		>
			Upload
		</Button>
	</div>
{/if}
