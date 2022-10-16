<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let size: 'lg' | 'md' | 'xs' = 'lg';
	export let status: 'loading' | 'success' | 'error' | 'unknown' = 'loading';
	export { classes as class };
	let classes = '-m-3';
</script>

<div class="{size === 'xs' ? 'p-3' : 'p-8'} relative overflow-hidden z-0 rounded-full {classes}">
	{#if status === 'loading'}
		<div
			transition:scale|local={{ duration: 300, easing: quadOut }}
			class="absolute w-full h-full left-0 top-0 origin-center"
		>
			<div class="w-full h-full">
				<div
					class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
				/>
			</div>
		</div>
	{/if}
	<div class="{size === 'xs' ? 'w-2.5 h-2.5' : 'w-10 h-10'} relative">
		{#if status === 'loading'}
			<div
				transition:scale|local={{ duration: 300, easing: quadOut }}
				class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary animate-ping-custom-bg"
			/>
		{/if}
		<div
			class="w-full h-full rounded-full transition-all duration-300 flex 
      items-center justify-center relative overflow-hidden z-0 {status === 'loading'
				? 'bg-c-primary'
				: status === 'success'
				? 'bg-c-success'
				: status === 'error'
				? 'bg-c-danger'
				: 'bg-c-on-bg/50'}"
		/>
	</div>
</div>
