<script lang="ts">
	import IconBack from '$components/icons/IconBack.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onBackButtonClicked: (() => void) | undefined = undefined;
	export let title: string;
</script>

<div class="w-full flex z-10 border-b-2 border-c-bg-tertiary">
	<button
		class="w-full relative bg-c-bg-secondary z-20 text-left px-6 h-full flex items-center transition-all self-stretch group"
		aria-label="Back"
		on:click={() => (onBackButtonClicked ? onBackButtonClicked() : null)}
		disabled={!onBackButtonClicked}
	>
		<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0">
			<div
				class="w-full h-full ease-out transition transform bg-c-primary/10
        absolute left-0 top-0 opacity-0 -translate-x-full {!$isTouchscreen &&
				onBackButtonClicked !== undefined
					? 'group-enabled:group-hover:translate-x-0 group-enabled:group-hover:opacity-100'
					: ''}"
			/>
		</div>
		<div
			class="transition-all transform {onBackButtonClicked !== undefined
				? 'w-6 h-6 opacity-100 -ml-1 mr-2'
				: 'w-0 h-0 p-0 opacity-0 mx-0'} {!$isTouchscreen && onBackButtonClicked !== undefined
				? 'group-hover:-translate-x-1'
				: ''}"
		>
			<IconBack
				class="w-full h-full transition {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
			/>
		</div>
		<p
			class="py-4 flex-1 transition min-w-0 overflow-hidden overflow-ellipsis font-bold text-xl {!$isTouchscreen &&
			onBackButtonClicked !== undefined
				? 'group-hover:text-c-primary'
				: ''}"
		>
			{title}
		</p>
	</button>
</div>
