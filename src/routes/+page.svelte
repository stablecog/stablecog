<script lang="ts">
	import CreateBar from '$components/CreateBar.svelte';
	import { generateImage } from '$ts/queries/generateImage';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TStatus } from '$ts/types/main';
	let status: TStatus = 'idle';
	let generatedImageSrc: string | undefined;
	let inputValue: string | undefined;

	async function onCreate() {
		if (!$serverUrl || !inputValue) return;
		status = 'loading';
		try {
			let res = await generateImage($serverUrl, inputValue);
			generatedImageSrc = res;
			console.log(generatedImageSrc);
			status = 'success';
		} catch (error) {
			status = 'error';
			console.log(error);
		}
	}
</script>

<div class="w-full flex flex-1 justify-center px-5 pt-12 pb-32">
	<CreateBar bind:inputValue {status} {onCreate} />
</div>
