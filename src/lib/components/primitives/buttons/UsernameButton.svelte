<script lang="ts">
	import Avatar from '$components/avatar/Avatar.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import { isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';

	export let username: string;
	export let email: string | undefined = undefined;
	export { classes as class };
	let classes = '';

	$: useEmail = isSuperAdmin($userSummary?.roles) || isGalleryAdmin($userSummary?.roles);
</script>

<a
	href="/{username}"
	data-sveltekit-preload-data="hover"
	on:click={() => activeGeneration.set(undefined)}
	class="max-w-full flex justify-start items-center gap-2.5 bg-c-bg-secondary
    rounded-full pl-1.5 py-1.5 pr-4 -ml-0.5 ring-2 ring-c-bg-tertiary shadow-lg
    shadow-c-shadow/[var(--o-shadow-strong)] relative group overflow-hidden z-0 {classes}"
>
	<ButtonHoverEffect color="bg-tertiary" hoverFrom="left" noPadding />
	<Avatar
		text={username}
		class="w-7 h-7 relative ring-2 ring-c-on-bg/25 rounded-full flex-shrink-0
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] items-center"
	/>
	<p
		class="flex-shrink min-w-0 font-medium text-c-on-bg not-touch:group-hover:text-c-primary
			transition overflow-hidden overflow-ellipsis relative whitespace-nowrap"
	>
		<span class="text-c-on-bg/50 not-touch:group-hover:text-c-primary/50 transition font-normal"
			>@</span
		>{username}{#if email && useEmail}<span
				class="text-c-on-bg/75 not-touch:group-hover:text-c-primary/75 transition text-sm"
				>&nbsp;({email})</span
			>{/if}
	</p>
</a>
