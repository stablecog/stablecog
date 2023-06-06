<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { apiUrl } from '$ts/constants/main';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { appVersion } from '$ts/stores/appVersion';
	import { sseId } from '$ts/stores/user/sse';
	import { queueInitialVoiceoverRequest } from '$ts/stores/user/voiceovers';

	export let value: string;

	const barkModelId = '0f442a3e-cf53-490b-b4a9-b0dda63e9523';
	const speakerId = '4a19f17c-eedc-4cf8-a45d-1f9d69547125';
	const temperature = 0.7;
	const seed = 12345;

	function onSubmit() {
		if (!$sseId) return;
		queueInitialVoiceoverRequest({
			model_id: barkModelId,
			speaker_id: speakerId,
			prompt: { id: 'prompt', text: value },
			temperature: temperature,
			num_outputs: 1,
			seed: seed,
			stream_id: $sseId,
			submit_to_gallery: false,
			ui_id: generateSSEId()
		});
	}
</script>

<form on:submit={onSubmit} class="w-full rounded-xl overflow-hidden relative">
	<textarea
		bind:value
		placeholder="I like to eat apples and bananas."
		class="w-full h-full bg-c-bg-secondary rounded-xl resize-none px-5 py-4 text-lg pb-24 placeholder:text-c-on-bg/40"
		rows="8"
		maxlength="500"
	/>
	<div
		class="absolute rounded-b-xl pointer-events-none w-full bottom-0 right-0 pt-24
    flex justify-end pr-3 pb-4 bg-gradient-to-t from-c-bg-secondary via-c-bg-secondary to-c-bg-secondary/0"
	>
		<Button class="pointer-events-auto">{$LL.Home.GenerateButton()}</Button>
	</div>
</form>
