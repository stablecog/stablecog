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
	class="group relative z-0 -ml-0.5 flex max-w-full
    items-center justify-start gap-2.5 overflow-hidden rounded-full bg-c-bg-secondary py-1.5 pl-1.5
    pr-4 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-tertiary {classes}"
>
	<ButtonHoverEffect color="bg-tertiary" hoverFrom="left" noPadding />
	<Avatar
		text={username}
		class="relative h-7 w-7 flex-shrink-0 items-center rounded-full shadow-lg
			shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-on-bg/25"
	/>
	<p
		class="relative min-w-0 flex-shrink overflow-hidden overflow-ellipsis
			whitespace-nowrap font-medium text-c-on-bg transition not-touch:group-hover:text-c-primary"
	>
		<span class="font-normal text-c-on-bg/50 transition not-touch:group-hover:text-c-primary/50"
			>@</span
		>{username}{#if email && useEmail}<span
				class="text-sm text-c-on-bg/75 transition not-touch:group-hover:text-c-primary/75"
				>&nbsp;({email})</span
			>{/if}
	</p>
</a>
