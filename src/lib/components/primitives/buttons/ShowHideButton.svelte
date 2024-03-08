<script lang="ts">
	import IconEyeOutline from '$components/icons/IconEyeOutline.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';

	export let disabled = false;
	export let isHidden = true;
	export { classes as class };
	let classes = '';

	function onClick() {
		isHidden = !isHidden;
	}
</script>

<button
	{disabled}
	on:click={onClick}
	type="button"
	class="group/showhidebutton touch-manipulation rounded-lg transition {classes}"
	aria-label="Show/Hide"
>
	<div class="relative z-0 overflow-hidden rounded-full bg-c-bg">
		<div
			class="absolute left-0 top-0 h-full w-full -translate-x-full transform rounded-full bg-c-primary transition
			not-touch:group-hover/showhidebutton:translate-x-0"
		/>
		<div class="h-12 w-12 p-2.5">
			<div class="relative h-full w-full">
				<IconEyeSlashOutline
					class="{isHidden
						? 'opacity-0'
						: 'opacity-100'} absolute left-0 top-0 h-full w-full text-c-on-bg transition
						not-touch:group-hover/showhidebutton:text-c-on-primary"
				/>
				<IconEyeOutline
					class="{!isHidden
						? 'opacity-0'
						: 'opacity-100'} absolute left-0 top-0 h-full w-full text-c-on-bg transition
						not-touch:group-hover/showhidebutton:text-c-on-primary"
				/>
			</div>
		</div>
		<p class="hidden">Show/Hide</p>
	</div>
</button>
