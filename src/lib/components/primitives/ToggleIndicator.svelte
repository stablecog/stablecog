<script lang="ts">
	import IconNotAllowed from '$components/icons/IconNotAllowed.svelte';

	export let isToggled: boolean = false;
	export let color: 'primary' | 'on-bg' | 'danger' = 'primary';
	export let disabled: boolean = false;
</script>

<div
	class="flex h-6 w-12 flex-shrink-0 items-center rounded-full transition {color == 'on-bg'
		? isToggled
			? 'bg-c-on-bg'
			: 'bg-c-on-bg/20'
		: color === 'danger'
			? isToggled
				? 'bg-c-danger'
				: 'bg-c-on-bg-secondary'
			: isToggled
				? 'bg-c-primary'
				: 'bg-c-on-bg-secondary'} pointer-events-none relative z-0 overflow-hidden"
>
	<div class="h-6 w-6 transition {isToggled ? 'translate-x-full' : ''} rounded-full p-0.5">
		<div
			class="flex h-full w-full items-center justify-center rounded-full {color === 'on-bg'
				? 'bg-c-bg'
				: 'bg-c-bg-secondary'}"
		/>
	</div>
	{#if disabled}
		<div class="h-6 w-6 {isToggled ? 'left-0' : 'right-0'} top-0 p-0.75">
			<IconNotAllowed
				strokeWidth={3}
				class="h-full w-full {color === 'on-bg' ? 'text-c-bg' : 'text-c-bg-secondary'}"
			/>
		</div>
	{/if}
</div>
