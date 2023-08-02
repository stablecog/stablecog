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

<button use:trigger {...$trigger} class="flex-shrink min-w-0 flex items-center gap-2">
	<p class="text-xl font-semibold flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
		<span class="text-c-on-bg/50 font-normal">@</span>{username}
	</p>
	<IconPen class="w-4 h-4 text-c-on-bg/50 flex-shrink-0" />
</button>
