<script lang="ts">
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';

	export let onClick: () => void;
	export let isClosed: boolean;
	export let side: 'left' | 'right';
	export let isClosedClass = '-translate-x-3.5';
	export let size: 'sm' | 'md' = 'md';

	let shouldShowButton = false;
	let isInside = false;
	let hasBeenInsideForMs = 0;
	let hasBeenInsideForMsInterval: NodeJS.Timeout;
	let hasBeenInsideForMsIntervalDelay = 50;
	let enoughTimeThreshold = 150;

	let isFirstChange = true;
	let isNewlyOpenedTimeout: NodeJS.Timeout;
	let isNewlyOpened = false;
	const isNewlyOpenedTimeoutDuration = 600;

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

	$: isClosed, onIsClosedChange();

	function onIsClosedChange() {
		if (isFirstChange) {
			isFirstChange = false;
			return;
		}
		if (isClosed) {
			isNewlyOpened = false;
			clearTimeout(isNewlyOpenedTimeout);
		} else {
			isNewlyOpened = true;
			isNewlyOpenedTimeout = setTimeout(() => {
				isNewlyOpened = false;
			}, isNewlyOpenedTimeoutDuration);
		}
	}

	function onIsInsideChange() {
		clearInterval(hasBeenInsideForMsInterval);
		hasBeenInsideForMs = 0;
		if (!isInside || isClosed) return;
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
	role="button"
	tabindex="0"
	class="h-full {size === 'sm' ? '-right-4.5 w-5' : '-right-7 w-8'} absolute transition {isClosed
		? isClosedClass
		: ''} top-0 z-20 flex transform cursor-default items-center justify-center"
>
	<div
		class="flex items-center justify-center rounded-full bg-c-bg shadow-lg ring-2
    ring-c-bg-secondary {isClosed
			? 'shadow-c-shadow/[var(--o-shadow-stronger)]'
			: 'shadow-c-shadow/[var(--o-shadow-strongest)]'} transform transition {shouldShowButton ||
		isClosed ||
		isNewlyOpened
			? size === 'sm'
				? '-translate-x-1.5 opacity-100'
				: '-translate-x-2.5 opacity-100'
			: 'translate-x-0 opacity-0'}"
	>
		<IconButton
			{onClick}
			disabled={!shouldShowButton && !isClosed}
			noPadding
			name="Hide Left Sidebar"
			hoverFrom={isClosed ? 'left' : 'right'}
		>
			<div class="p-2">
				<IconChevronDown
					class="h-6 w-6 transform text-c-on-bg/50 transition {isClosed
						? side === 'right'
							? 'rotate-90'
							: '-rotate-90'
						: side === 'right'
							? '-rotate-90'
							: 'rotate-90'} not-touch:group-hover/iconbutton:text-c-primary"
				/>
			</div>
		</IconButton>
	</div>
</div>
