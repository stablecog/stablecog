<script lang="ts">
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import { copy } from 'svelte-copy';

	export let stringToCopy: string;
	export let disabled = false;
	export let onCopied: (() => void) | undefined = undefined;
	export let copied = false;
	export let copiedTimeout: NodeJS.Timeout | undefined = undefined;
	export { classes as class };
	let classes = '';

	let element: HTMLButtonElement;

	const onCopy = () => {
		copied = true;
		element.blur();
		clearTimeout(copiedTimeout);
		copiedTimeout = setTimeout(() => {
			copied = false;
		}, 2000);
		if (onCopied) {
			onCopied();
		}
	};
</script>

<button
	bind:this={element}
	use:copy={stringToCopy}
	on:svelte-copy={onCopy}
	on:svelte-copy:error={(e) => console.log(e)}
	{disabled}
	type="button"
	class="group/copybutton relative z-0
	touch-manipulation overflow-hidden rounded-full bg-c-bg p-2.5 transition
	before:absolute before:left-0 before:top-0 before:h-full before:w-full
	before:-translate-x-full before:transform
	before:rounded-full before:transition before:not-touch:hover/copybutton:translate-x-0 {copied
		? 'before:bg-c-bg'
		: 'before:bg-c-primary'} {classes}"
	aria-label="Copy to Clipboard"
>
	<IconCopy
		class="transform {copied
			? 'scale-0 opacity-0'
			: 'scale-100 opacity-100'} h-7 w-7 text-c-on-bg transition
						not-touch:group-hover/copybutton:text-c-on-primary"
	/>
	<IconTick
		class="absolute left-2.5 top-2.5 h-7 w-7 transform {!copied
			? 'scale-0 opacity-0'
			: 'scale-175 opacity-100'} text-c-success transition"
	/>
</button>
