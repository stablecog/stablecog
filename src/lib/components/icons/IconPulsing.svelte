<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let status: 'loading' | 'success' | 'error' | 'unknown' = 'loading';
	export { classes as class };
	let classes = 'w-12 h-12';
</script>

<div class="{classes} pointer-events-none z-0">
	<div class="w-full h-full relative overflow-hidden z-0 rounded-full">
		<div class="w-full h-full absolute left-0 top-0">
			{#if status === 'loading'}
				<div
					transition:scale={{ duration: 300, easing: quadOut }}
					class="absolute w-full h-full left-0 top-0 origin-center"
				>
					<div class="w-full h-full">
						<div
							class="w-full h-full absolute left-0 top-0 rounded-full bg-c-primary/50 animate-ping-custom"
						/>
					</div>
				</div>
			{/if}
		</div>
		<div class="w-full h-full p-[30%] relative">
			<div class="w-full h-full relative">
				{#if status === 'loading'}
					<div
						transition:scale={{ duration: 300, easing: quadOut }}
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
	</div>
</div>
