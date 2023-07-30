<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$components/avatar/Avatar.svelte';
</script>

<div class="w-full flex items-center gap-3.5 px-4.5 py-3.5">
	<Avatar
		class="w-8 h-8 ring-2 ring-c-on-bg/25 rounded-full transition transform
    relative shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] items-center justify-center overflow-hidden"
		text={$page.data.session?.user.email || ''}
	/>
	<div class="min-w-0 flex-1 flex flex-col">
		<p
			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis font-bold transition
			not-touch:group-hover:text-c-primary"
		>
			{$page.data.session?.user.email}
		</p>
	</div>
</div>
