<script lang="ts">
	import IconToken from '$components/icons/IconToken.svelte';

	export let neededCredits: number;
	export let remainingCredits: number;
</script>

<div
	class="pointer-events-none absolute -right-1 -top-1 flex justify-end md:-right-1.5 md:-top-1.5"
>
	<div
		class="z-10 max-w-full rounded-md bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] md:rounded-lg"
	>
		<div
			class="flex w-full items-center rounded-md border-2 border-c-secondary/20 bg-c-secondary/10 px-1.25 md:rounded-lg md:px-1.5"
		>
			<IconToken class="-ml-0.5 h-4 w-4 flex-shrink-0 text-c-secondary" />
			<p
				class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis py-0.5 text-xs font-medium text-c-secondary md:py-0.75"
			>
				{remainingCredits}/{neededCredits}
			</p>
		</div>
	</div>
</div>
