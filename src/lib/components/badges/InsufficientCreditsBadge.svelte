<script lang="ts">
	import IconToken from '$components/icons/IconToken.svelte';

	export let neededCredits: number;
	export let remainingCredits: number;
</script>

<div class="w-full flex justify-end absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5">
	<div
		class="max-w-full z-10 bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] rounded-lg"
	>
		<div
			class="w-full px-1.25 md:px-1.5 border-2 bg-c-secondary/10 border-c-secondary/20 rounded-lg gap-1 flex items-center"
		>
			<IconToken class="w-4 h-4 -ml-0.25 flex-shrink-0 text-c-secondary" />
			<p
				class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis text-xs font-medium text-c-secondary py-0.75 md:py-1"
			>
				{remainingCredits}/{neededCredits}
			</p>
		</div>
	</div>
</div>
