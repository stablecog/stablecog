<script lang="ts">
	import IconNotAllowed from '$components/icons/IconNotAllowed.svelte';

	export let isToggled: boolean = false;
	export let color: 'primary' | 'on-bg' = 'primary';
	export let disabled: boolean = false;
</script>

<div
	class="w-12 flex-shrink-0 h-6 flex items-center rounded-full transition {color == 'on-bg'
		? isToggled
			? 'bg-c-on-bg'
			: 'bg-c-on-bg/20'
		: isToggled
		? 'bg-c-primary'
		: 'bg-c-on-bg-secondary'} relative z-0 overflow-hidden pointer-events-none"
>
	<div class="w-6 h-6 transition {isToggled ? 'translate-x-full' : ''} rounded-full p-0.5">
		<div
			class="w-full h-full rounded-full flex items-center justify-center {color === 'on-bg'
				? 'bg-c-bg'
				: 'bg-c-bg-secondary'}"
		/>
	</div>
	{#if disabled}
		<div class="w-6 h-6 {isToggled ? 'left-0' : 'right-0'} top-0 p-0.75">
			<IconNotAllowed
				strokeWidth={3}
				class="w-full h-full {color === 'on-bg' ? 'text-c-bg' : 'text-c-bg-secondary'}"
			/>
		</div>
	{/if}
</div>
