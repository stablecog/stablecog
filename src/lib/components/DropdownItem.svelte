<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: () => void;
	export let padding: 'xl' | 'lg' | 'md' | 'sm' = 'xl';
	export let disabled = false;
</script>

<button
	{disabled}
	on:click={onClick}
	class="w-full font-bold px-5 {padding === 'sm'
		? 'py-3'
		: padding === 'md'
		? 'py-4'
		: padding === 'lg'
		? 'py-4.5'
		: 'py-5'} relative z-0 overflow-hidden group"
>
	<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
		<div
			class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
				bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
		/>
	</div>
	<slot />
</button>
