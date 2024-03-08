<script lang="ts">
	export let morphed = false;
	export { classes as class };
	let classes = '';
</script>

<div class="relative {classes}">
	<div
		style="transition: transform {!morphed
			? '0.25s cubic-bezier(.3,2,.5,.8)'
			: '0.1s cubic-bezier(0.4, 0, 0.2, 1)'}, opacity {!morphed
			? '0.25s'
			: '0.1s'} cubic-bezier(0.4, 0, 0.2, 1);"
		class="relative transform {!morphed
			? 'scale-100 opacity-100'
			: 'pointer-events-none scale-50 opacity-0'}"
	>
		<div class="transition-none">
			<slot name="0" />
		</div>
	</div>
	<div
		style="transition: transform {morphed
			? '0.25s cubic-bezier(.3,2,.5,.8)'
			: '0.1s cubic-bezier(0.4, 0, 0.2, 1)'}, opacity {morphed
			? '0.25s'
			: '0.1s'} cubic-bezier(0.4, 0, 0.2, 1);"
		class="absolute left-0 top-0 flex h-full w-full transform items-center justify-center {morphed
			? 'scale-100 opacity-100 duration-250 ease-bounce-out'
			: 'duratiton-150 pointer-events-none scale-50 opacity-0'}"
	>
		<div class="transition-none">
			<slot name="1" />
		</div>
	</div>
</div>
