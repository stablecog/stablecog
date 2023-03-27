<script lang="ts">
	import { expandCollapse } from '$ts/animation/transitions';

	export { classes as class };
	export let alignment = 'right-0 top-0';
	let classes = '';
</script>

<div
	transition:expandCollapse|local={{ duration: 200 }}
	class="transition-all ring-2 ring-c-bg-tertiary bg-c-bg-secondary 
	rounded-xl flex flex-col justify-start shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
	absolute {alignment} overflow-hidden z-50 {classes}"
>
	<div class="w-full flex flex-col justify-start z-0 overflow-hidden relative">
		<slot />
	</div>
</div>
