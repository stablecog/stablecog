<script lang="ts">
	export let src: string;
	export let srcset: string;
	export let loading: 'lazy' | undefined = 'lazy';
	export let alt: string;
	export let sizes: string;
	export let width: number;
	export let height: number;
	export let fade: boolean = false;

	export { classes as class };
	let classes = '';

	let naturalWidth: number;
	let naturalHeight: number;
</script>

<img
	bind:naturalWidth
	bind:naturalHeight
	class="{classes} {fade ? 'transition ease-out' : ''} {fade
		? naturalWidth && naturalHeight
			? 'opacity-100'
			: 'opacity-0'
		: ''}"
	{src}
	{srcset}
	{sizes}
	{loading}
	{alt}
	{width}
	{height}
/>
