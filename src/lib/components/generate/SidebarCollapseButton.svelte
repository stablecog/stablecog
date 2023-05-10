<script lang="ts">
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: () => void;
	export let isClosed: boolean;
	export let side: 'left' | 'right';

	let shouldShowButton = false;
	let isInside = false;
	let hasBeenInsideForMs = 0;
	let hasBeenInsideForMsInterval: NodeJS.Timeout;
	let hasBeenInsideForMsIntervalDelay = 100;
	let enoughTimeThreshold = 250;

	const onMouseEnter = () => {
		isInside = true;
	};

	const onMouseLeave = () => {
		isInside = false;
	};

	$: [isInside], onIsInsideChange();

	$: if (hasBeenInsideForMs > enoughTimeThreshold && isInside) {
		shouldShowButton = true;
	} else {
		shouldShowButton = false;
	}

	function onIsInsideChange() {
		clearInterval(hasBeenInsideForMsInterval);
		hasBeenInsideForMs = 0;
		if (!isInside) return;
		const startTime = Date.now();
		hasBeenInsideForMsInterval = setInterval(() => {
			hasBeenInsideForMs = Date.now() - startTime;
			if (hasBeenInsideForMs > enoughTimeThreshold) clearInterval(hasBeenInsideForMsInterval);
		}, hasBeenInsideForMsIntervalDelay);
	}
</script>

<div
	on:mouseenter|preventDefault={onMouseEnter}
	on:focus|preventDefault={() => null}
	on:mouseleave|preventDefault={onMouseLeave}
	on:blur|preventDefault={() => null}
	class="h-full w-5 absolute -right-2.5 transition {isClosed
		? '-translate-x-3'
		: ''} top-0 flex items-center justify-center transform z-20"
>
	<div
		class="rounded-full bg-c-bg ring-2 ring-c-bg-secondary flex items-center justify-center
    shadow-xl shadow-c-shadow/[var(--o-shadow-strongest)] transform transition {shouldShowButton ||
		isClosed
			? 'opacity-100 translate-x-0'
			: 'opacity-0 translate-x-2'} pointer-events-auto"
	>
		<IconButton
			{onClick}
			disabled={!shouldShowButton && !isClosed}
			noPadding
			name="Hide Left Sidebar"
		>
			<div class="p-2">
				<IconChevronDown
					class="text-c-on-bg/50 w-6 h-6 transform {isClosed
						? side === 'right'
							? 'rotate-90'
							: '-rotate-90'
						: side === 'right'
						? '-rotate-90'
						: 'rotate-90'} {!$isTouchscreen ? 'group-hover/iconbutton:text-c-primary' : ''}"
				/>
			</div>
		</IconButton>
	</div>
</div>