<script lang="ts">
	import IconPen from '$components/icons/IconPen.svelte';
	import type { ExplicitBuilderReturn } from '@melt-ui/svelte/internal/helpers';
	import type { Writable } from 'svelte/store';

	export let trigger: ExplicitBuilderReturn<
		Writable<boolean>,
		(node: HTMLElement) => {
			destroy: VoidFunction;
		},
		($open: boolean) => {
			readonly 'aria-haspopup': 'dialog';
			readonly 'aria-expanded': boolean;
			readonly 'aria-controls': string;
			readonly type: 'button';
		},
		string
	>;
	export let username: string | undefined;
</script>

<button use:trigger {...$trigger} class="flex min-w-0 flex-shrink items-center gap-2">
	<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis text-xl font-semibold">
		<span class="font-normal text-c-on-bg/50">@</span>{username}
	</p>
	<IconPen class="h-4 w-4 flex-shrink-0 text-c-on-bg/50" />
</button>
