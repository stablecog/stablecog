<script lang="ts">
	export let src: string;
	export let srcset: string;
	export let sizes: string;
	export let alt: string;
	export let width: string;
	export let height: string;
	export let classOutline: string;
	export let srcOutline: string;
	export let altOutline: string;
	export let srcPlaceholder: string;
	export let classPlaceholder: string;

	export { classes as class };
	export { styles as style };
	let classes = '';
	let styles = '';
</script>

<img
	style={styles}
	class="{classPlaceholder} absolute right-0 top-0"
	src={srcPlaceholder}
	{alt}
	{width}
	{height}
/>
<img style={styles} class={classes} {srcset} {sizes} {src} {alt} {width} {height} />
<img class={classOutline} src={srcOutline} alt={altOutline} {width} height={width} />
