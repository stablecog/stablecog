<script lang="ts">
	import type { TUserVoiceoverFullOutputsPage } from '$ts/queries/userVoiceovers';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';

	export let query: CreateInfiniteQueryResult<TUserVoiceoverFullOutputsPage, unknown> | undefined;

	$: outputs = $query?.data?.pages?.flatMap((p) => p.outputs);
</script>
