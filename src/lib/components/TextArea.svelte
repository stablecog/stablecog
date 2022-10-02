<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string | undefined;
	export let disabled = false;
	export let placeholder = '';
	export { classes as class };
	let classes = '';

	let element: HTMLTextAreaElement | undefined;

	function onInput() {
		if (!element) return;
		element.style.height = '0px';
		element.style.height = element.scrollHeight + 'px';
	}

	onMount(() => {
		if (!element) return;
		element.setAttribute('style', `height: ${element.scrollHeight}px`);
	});
</script>

<textarea
	bind:this={element}
	bind:value
	on:input={onInput}
	rows="1"
	{disabled}
	{placeholder}
	class="resize-none {classes}"
/>
