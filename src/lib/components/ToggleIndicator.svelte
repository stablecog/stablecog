<script lang="ts">
	export let isToggled: boolean = false;
	export let color: 'primary' | 'on-bg' = 'primary';
</script>

<div
	class="w-12 flex-shrink-0 h-6 flex items-center rounded-full transition {color == 'on-bg'
		? isToggled
			? 'bg-c-on-bg'
			: 'bg-c-on-bg/20'
		: isToggled
		? 'bg-c-primary'
		: 'bg-c-on-bg/25'} relative z-0 overflow-hidden pointer-events-none"
>
	<div class="w-6 h-6 transition {isToggled ? 'translate-x-full' : ''} rounded-full p-0.5">
		<div class="w-full h-full rounded-full {color === 'on-bg' ? 'bg-c-bg' : 'bg-c-bg-secondary'}" />
	</div>
</div>
