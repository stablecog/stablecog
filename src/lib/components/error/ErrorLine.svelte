<script lang="ts">
	import { expandCollapse } from '$ts/animation/transitions';

	export let text: string;
	export { classes as class };
	export let size: 'sm' | 'md' = 'md';
	let classes = 'text-sm';
</script>

<div transition:expandCollapse={{ duration: 150 }} class={classes}>
	<div class={size === 'sm' ? 'pt-2.5' : 'pt-3.5'}>
		<p class="{size === 'sm' ? 'px-3 py-2' : 'px-4 py-3'} rounded-lg bg-c-danger/8 text-c-danger">
			{text}
		</p>
	</div>
</div>
