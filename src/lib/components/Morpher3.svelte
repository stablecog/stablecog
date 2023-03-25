<script lang="ts">
	export let state = 0;
	export { classes as class };
	let classes = '';
</script>

<div class="relative {classes}">
	<div
		style="transition: transform {state === 0
			? '0.25s cubic-bezier(.3,2,.5,.8)'
			: '0.1s cubic-bezier(0.4, 0, 0.2, 1)'}, opacity {state === 0
			? '0.25s'
			: '0.1s'} cubic-bezier(0.4, 0, 0.2, 1);"
		class="transition relative transform {state === 0
			? 'scale-100 opacity-100'
			: 'scale-50 opacity-0 pointer-events-none'}"
	>
		<div class="transition-none">
			<slot name="0" />
		</div>
	</div>
	<div
		style="transition: transform {state === 1
			? '0.25s cubic-bezier(.3,2,.5,.8)'
			: '0.1s cubic-bezier(0.4, 0, 0.2, 1)'}, opacity {state === 1
			? '0.25s'
			: '0.1s'} cubic-bezier(0.4, 0, 0.2, 1);"
		class="w-full h-full absolute transform left-0 top-0 flex items-center justify-center {state ===
		1
			? 'scale-100 opacity-100'
			: 'scale-50 opacity-0 pointer-events-none'}"
	>
		<div class="transition-none">
			<slot name="1" />
		</div>
	</div>
	<div
		style="transition: transform {state === 2
			? '0.25s cubic-bezier(.3,2,.5,.8)'
			: '0.1s cubic-bezier(0.4, 0, 0.2, 1)'}, opacity {state === 2
			? '0.25s'
			: '0.1s'} cubic-bezier(0.4, 0, 0.2, 1);"
		class="w-full h-full absolute transform left-0 top-0 flex items-center justify-center {state ===
		2
			? 'scale-100 opacity-100'
			: 'scale-50 opacity-0 pointer-events-none'}"
	>
		<div class="transition-none">
			<slot name="2" />
		</div>
	</div>
</div>
