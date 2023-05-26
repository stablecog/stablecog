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
	class="touch-manipulation transition rounded-lg group/showhidebutton {classes}"
	aria-label="Show/Hide"
>
	<div class="rounded-full bg-c-bg relative overflow-hidden z-0">
		<div
			class="w-full h-full rounded-full transition transform -translate-x-full absolute left-0 top-0 bg-c-primary
			not-touch:group-hover/showhidebutton:translate-x-0"
		/>
		<div class="w-12 h-12 p-2.5">
			<div class="w-full h-full relative">
				<IconEyeSlashOutline
					class="{isHidden
						? 'opacity-0'
						: 'opacity-100'} w-full h-full absolute left-0 top-0 text-c-on-bg transition
						not-touch:group-hover/showhidebutton:text-c-on-primary"
				/>
				<IconEyeOutline
					class="{!isHidden
						? 'opacity-0'
						: 'opacity-100'} w-full h-full absolute left-0 top-0 text-c-on-bg transition
						not-touch:group-hover/showhidebutton:text-c-on-primary"
				/>
			</div>
		</div>
		<p class="hidden">Show/Hide</p>
	</div>
</button>
