<script lang="ts">
	export let morphed = false;
	export { classes as class };
	let classes = '';
</script>

<div class="relative {classes}">
	<div
		class="transition relative duration-250 transform {!morphed
			? 'scale-100 opacity-100'
			: 'scale-50 opacity-0 pointer-events-none'}"
	>
		<div class="transition-none">
			<slot name="item-0" />
		</div>
	</div>
	<div
		class="transition duration-250 w-full h-full absolute transform left-0 top-0 flex items-center justify-center {morphed
			? 'scale-100 opacity-100'
			: 'scale-50 opacity-0 pointer-events-none'}"
	>
		<div class="transition-none">
			<slot name="item-1" />
		</div>
	</div>
</div>
