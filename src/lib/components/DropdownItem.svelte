<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: () => void;
	export let twoLine = false;
	export let disabled = false;
</script>

<button
	{disabled}
	on:click={onClick}
	class="w-full font-bold px-5 {twoLine ? 'py-4' : 'py-5'} relative z-0 overflow-hidden group"
>
	<div
		class="w-full h-full origin-left transition transform -translate-x-full 
			  bg-c-primary/10 absolute left-0 top-0 opacity-0 {!$isTouchscreen
			? 'group-enabled:group-hover:translate-x-0 group-enabled:group-hover:opacity-100'
			: ''}"
	/>
	<slot />
</button>
