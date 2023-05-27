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
	<div class="rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-full absolute left-0 top-0 {copied
				? 'bg-c-bg'
				: 'bg-c-primary'} not-touch:group-hover/copybutton:translate-x-0"
		/>
		<div class="w-12 h-12 p-2.5">
			<div class="w-full h-full relative">
				<IconCopy
					class="{copied
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'} w-full h-full absolute left-0 top-0 transition text-c-on-bg
						not-touch:group-hover/copybutton:text-c-on-primary"
				/>
				<IconTick
					class="{!copied
						? 'scale-0 opacity-0'
						: 'scale-175 opacity-100'} w-full h-full absolute left-0 top-0 transition text-c-success"
				/>
			</div>
		</div>
		<p class="hidden">Copy to Clipboard</p>
	</div>
</button>
