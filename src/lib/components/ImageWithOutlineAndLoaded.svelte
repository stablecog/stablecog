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
	export let classWhenLoaded = 'opacity-100';
	export let classWhenNotLoaded = 'opacity-0';
	export let isLoaded = false;

	export { classes as class };
	export { styles as style };
	let classes = '';
	let styles = '';

	let naturalWidth: number;
	let naturalHeight: number;

	$: [naturalWidth, naturalHeight], onNaturalSizeChanged();

	function onNaturalSizeChanged() {
		if (naturalWidth > 50 && naturalHeight > 50) {
			isLoaded = true;
		}
	}
</script>

<slot {isLoaded} />
<img
	bind:naturalWidth
	bind:naturalHeight
	on:load={() => (isLoaded = true)}
	style={styles}
	class="{classes} {isLoaded ? classWhenLoaded : classWhenNotLoaded}"
	{srcset}
	{sizes}
	{src}
	{alt}
	{width}
	{height}
/>
<slot name="after-image" {isLoaded} />
<img
	class="{classOutline} {isLoaded ? classWhenLoaded : classWhenNotLoaded}"
	src={srcOutline}
	alt={altOutline}
	{width}
	height={width}
/>
