<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let value: number;
	export let placeholder: string | undefined = undefined;
	export { classes as class };
	let classes = '';

	let inputElement: HTMLInputElement;
</script>

<div
	class="w-full flex items-stretch bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] 
	ring-2 ring-c-bg-secondary rounded-xl transition relative {classes}"
>
	<div class="self-stretch flex text-c-on-bg/30">
		<slot name="title" />
	</div>
	<div class="w-2px mr-px -ml-px self-stretch">
		<div class="w-full h-full bg-c-bg-secondary" />
	</div>
	<div class="flex-1 min-w-0 flex relative rounded-r-xl">
		<input
			on:submit|preventDefault
			bind:this={inputElement}
			bind:value
			on:input={() => {
				if (value !== null && value !== undefined && value.toString().length > 15) {
					value = parseInt(value.toString().slice(0, 15));
				}
			}}
			{placeholder}
			type="number"
			class="w-full text-c-on-bg/75 self-stretch overflow-ellipsis ring-0 transition ring-c-primary/20 focus:ring-2 
			px-5 py-3 md:py-3.5 rounded-r-xl bg-transparent placeholder:text-c-on-bg/30 {!$isTouchscreen
				? 'hover:ring-2'
				: ''}"
		/>
	</div>
</div>
