<script lang="ts">
	import { expandCollapse } from '$ts/animation/transitions';

	export let text: string;
	export { classes as class };
	let classes = 'text-sm';
</script>

<div transition:expandCollapse={{ duration: 150 }} class={classes}>
	<div class="pt-3.5">
		<p class="py-3 px-4 bg-c-danger/8 rounded-lg text-c-danger">
			{text}
		</p>
	</div>
</div>
