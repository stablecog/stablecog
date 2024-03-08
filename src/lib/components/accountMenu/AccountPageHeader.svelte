<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import { userSummary } from '$ts/stores/user/summary';
</script>

<div class="flex w-full items-center gap-2.5 px-4.5 py-4">
	<Avatar
		class="relative h-7 w-7 transform items-center justify-center overflow-hidden
    rounded-full shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-on-bg/25 transition"
		text={$userSummary?.username || ''}
	/>
	<div class="flex min-w-0 flex-1 flex-col">
		<p
			class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-lg font-bold text-c-on-bg
			transition not-touch:group-hover:text-c-primary"
		>
			<span
				class="font-semibold text-c-on-bg/50
				transition not-touch:group-hover:text-c-primary/50">@</span
			>{$userSummary?.username}
		</p>
	</div>
</div>
