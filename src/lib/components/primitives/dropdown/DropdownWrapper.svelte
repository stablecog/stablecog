<script lang="ts">
	import { expandCollapse } from '$ts/animation/transitions';

	export { classes as class };
	export let alignment = 'right-0 top-0';
	let classes = '';
</script>

<div
	transition:expandCollapse={{ duration: 200 }}
	class="absolute flex flex-col justify-start
	rounded-xl bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary
	transition-all {alignment} z-50 overflow-hidden {classes}"
>
	<div class="relative z-0 flex w-full flex-col justify-start overflow-hidden">
		<slot />
	</div>
</div>
