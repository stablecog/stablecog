<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import IconWarning from '$components/icons/IconWarning.svelte';
	import LL from '$i18n/i18n-svelte';
	import { userSummary } from '$ts/stores/user/summary';
</script>

<div class="flex w-full items-center gap-2.5 px-4.5 py-4">
	<Avatar
		class="relative h-7 w-7 transform items-center justify-center overflow-hidden
    rounded-full shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-on-bg/25 transition"
		text={$userSummary?.username || ''}
	/>
	<div class="flex min-w-0 flex-1 flex-col items-start">
		<p
			class="min-w-0 flex-1 overflow-hidden overflow-ellipsis text-lg font-bold text-c-on-bg
			transition not-touch:group-hover:text-c-primary {$userSummary?.scheduled_for_deletion_on
				? '-mt-1'
				: ''}"
		>
			<span
				class="font-semibold text-c-on-bg/50
				transition not-touch:group-hover:text-c-primary/50">@</span
			>{$userSummary?.username}
		</p>
		{#if $userSummary?.scheduled_for_deletion_on}
			<div
				class="mt-1 flex items-center gap-1 rounded bg-c-danger/10 px-1.5 py-0.75 text-xs font-medium text-c-danger"
			>
				<IconWarning class="size-3 shrink-0" />
				<p class="flex-shrink">{$LL.Account.AccountScheduledForDeletionTitle()}</p>
			</div>
		{/if}
	</div>
</div>
