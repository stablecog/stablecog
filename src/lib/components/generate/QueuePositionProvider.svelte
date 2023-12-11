<script lang="ts">
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import type { TGeneration } from '$ts/stores/user/generation';
	import { getQueuePositionFromId, queue } from '$ts/stores/user/queue';
	import { userSummary } from '$ts/stores/user/summary';

	export let generation: TGeneration;

	$: positionInQueue = getQueuePositionFromId(generation.queued_id, $queue);
	$: positionInQueue, onPositionInQueueChanged();

	let debouncedPositionInQueue: number | undefined = undefined;
	let positionInQueueTimeout: NodeJS.Timeout;

	function onPositionInQueueChanged() {
		let hasPrevValue = debouncedPositionInQueue !== undefined;
		clearTimeout(positionInQueueTimeout);
		// First entry
		if (positionInQueue !== undefined && !hasPrevValue) {
			positionInQueueTimeout = setTimeout(() => {
				debouncedPositionInQueue = positionInQueue;
			}, 750);
			return;
		}
		// Updates after the first entry except exit
		if (positionInQueue !== undefined && hasPrevValue) {
			debouncedPositionInQueue = positionInQueue;
			return;
		}
		// Exit
		positionInQueueTimeout = setTimeout(() => {
			debouncedPositionInQueue = positionInQueue;
		}, 2000);
	}

	$: isFreeUser = !$userSummary?.product_id && !$userSummary?.has_nonfree_credits;
	$: finalPositionInQueue = debouncedPositionInQueue !== undefined ? debouncedPositionInQueue : 0;
	$: showQueuePosition =
		debouncedPositionInQueue !== undefined && (isFreeUser || isSuperAdmin($userSummary?.roles));
</script>

<slot positionInQueue={finalPositionInQueue} {showQueuePosition} />
