<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { Options } from 'svelte-inview';

	export let src: string;
	export let srcset: string;
	export let sizes: string;
	export let alt: string;
	export let width: string;
	export let height: string;
	export let placeholder: string;

	export { classes as class };
	export { styles as style };
	let classes = '';
	let styles = '';

	let wasInView = false;
	let isLoaded = false;
	let naturalWidth: number;
	let naturalHeight: number;

	const options: Options = {
		rootMargin: '75%',
		unobserveOnEnter: true
	};

	$: [naturalWidth, naturalHeight], onNaturalSizeChanged();
	$: shouldShow = wasInView && isLoaded;

	function onNaturalSizeChanged() {
		if (naturalWidth > 50 && naturalHeight > 50) {
			isLoaded = true;
		}
	}
</script>

<img
	bind:naturalWidth
	bind:naturalHeight
	on:load={() => (isLoaded = true)}
	use:inview={options}
	on:inview_enter={() => {
		console.log('inView');
		wasInView = true;
	}}
	style={styles}
	class="{classes} transition duration-300 ease-in filter {shouldShow ? 'blur-none' : 'blur-xl'}"
	srcset={wasInView ? srcset : undefined}
	sizes={wasInView ? sizes : undefined}
	src={wasInView ? src : placeholder}
	{alt}
	{width}
	{height}
/>
