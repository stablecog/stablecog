<script lang="ts">
	export let overflowXScroll = true;
</script>

<div
	class="w-full flex flex-col justify-start items-start rounded-2xl bg-c-bg relative z-0
	shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary {overflowXScroll
		? 'overflow-x-auto overflow-y-hidden'
		: ''} hide-scrollbar"
>
	<slot />
</div>
