<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import { userSummary } from '$ts/stores/user/summary';
</script>

<div class="w-full flex items-center gap-2.5 px-4.5 py-4">
	<Avatar
		class="w-7 h-7 ring-2 ring-c-on-bg/25 rounded-full transition transform
    relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] items-center justify-center overflow-hidden"
		text={$userSummary?.username || ''}
	/>
	<div class="min-w-0 flex-1 flex flex-col">
		<p
			class="text-lg flex-1 min-w-0 overflow-hidden overflow-ellipsis font-bold text-c-on-bg
			not-touch:group-hover:text-c-primary transition"
		>
			<span
				class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50
				font-semibold">@</span
			>{$userSummary?.username}
		</p>
	</div>
</div>
