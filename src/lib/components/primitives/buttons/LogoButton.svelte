<script lang="ts">
	import Logo from '$components/Logo.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';

	export { classes as class };
	export let onClick: () => void = () => null;
	let classes = '';
</script>

<a
	aria-label="Go to Home"
	href={$userSummary && $sessionStore?.user.id ? '/generate' : '/'}
	on:click={onClick}
	data-sveltekit-preload-data="hover"
	class="group relative z-0 flex touch-manipulation items-center justify-center self-stretch rounded-lg px-2 py-3.5 md:rounded-xl md:px-3 md:py-4.5 {classes}"
>
	<div class="pointer-events-none absolute left-0 top-0 h-full w-full p-1.5">
		<div class="relative z-0 h-full w-full overflow-hidden rounded-lg md:rounded-xl">
			<div
				class="h-full w-full origin-left -translate-x-full transform rounded-lg bg-c-primary/25 transition
    		not-touch:group-hover:translate-x-0 md:rounded-xl"
			/>
		</div>
	</div>
	<Logo class="h-9 w-9" />
</a>
