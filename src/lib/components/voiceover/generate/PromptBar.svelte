<script>
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<div class="w-full rounded-xl overflow-hidden relative">
	<textarea
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
</div>
