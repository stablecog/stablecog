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
	class="touch-manipulation transition rounded-lg group/copybutton {classes}"
	aria-label="Copy to Clipboard"
>
	<div
		class="rounded-full bg-c-bg relative overflow-hidden z-0 p-2.5
		after:w-full after:h-full after:absolute after:left-0 after:top-0
		after:-translate-x-full after:not-touch:group-hover/copybutton:translate-x-0
		after:rounded-full after:transition after:transform after:z-[-1] {copied
			? 'after:bg-c-bg'
			: 'after:bg-c-primary'}"
	>
		<IconCopy
			class="transform {copied
				? 'scale-0 opacity-0'
				: 'scale-100 opacity-100'} w-7 h-7 transition text-c-on-bg
						not-touch:group-hover/copybutton:text-c-on-primary"
		/>
		<IconTick
			class="transform absolute left-2.5 top-2.5 w-7 h-7 {!copied
				? 'scale-0 opacity-0'
				: 'scale-175 opacity-100'} transition text-c-success"
		/>
	</div>
</button>
