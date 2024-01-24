<script lang="ts">
	import LazyImage from '$components/utils/LazyImage.svelte';

	export let src: string;
	export let srcset: string;
	export let sizes: string;
	export let alt: string;
	export let width: string;
	export let height: string;
	export let classOutline: string;
	export let srcOutline: string;
	export let altOutline: string;
	export let placeholder: string;

	export { classes as class };
	export { styles as style };
	let classes = '';
	let styles = '';
</script>

<div class={classes} style={styles}>
	<LazyImage {srcset} {sizes} {src} {placeholder} {alt} {width} {height} />
</div>

<img class={classOutline} src={srcOutline} alt={altOutline} {width} height={width} />
