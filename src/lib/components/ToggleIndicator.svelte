<script lang="ts">
	export let isToggled: boolean = false;
</script>

<div
	class="w-12 h-6 flex items-center rounded-full transition {isToggled
		? 'bg-c-primary'
		: 'bg-c-on-bg/25'} relative z-0 overflow-hidden"
>
	<div class="w-6 h-6 transition {isToggled ? 'translate-x-full' : ''} rounded-full p-0.5">
		<div class="w-full h-full rounded-full bg-c-bg-secondary" />
	</div>
</div>
