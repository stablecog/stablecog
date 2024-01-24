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
			: 'scale-50 opacity-0 pointer-events-none'}"
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
		class="w-full h-full absolute transform left-0 top-0 flex items-center justify-center {morphed
			? 'scale-100 opacity-100 ease-bounce-out duration-250'
			: 'scale-50 opacity-0 pointer-events-none duratiton-150'}"
	>
		<div class="transition-none">
			<slot name="1" />
		</div>
	</div>
</div>
