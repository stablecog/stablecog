<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { tweened, type Tweened } from 'svelte/motion';
	import { quadOut } from 'svelte/easing';

	export let animationTime = 3000;
	export let completionTime = 300;
	export let delay = 250;

	type TProgressType = 'before' | 'after';

	let progressType: TProgressType = 'before';

	let progressBefore: Tweened<number>;
	let progressAfter: Tweened<number>;

	function resetProgressBefore() {
		progressBefore = tweened(0, {
			duration: animationTime,
			easing: quadOut,
			delay: delay
		});
	}

	function resetProgressAfter() {
		progressAfter = tweened($progressBefore, {
			duration: completionTime,
			easing: quadOut
		});
	}

	resetProgressBefore();
	resetProgressAfter();

	beforeNavigate(() => {
		resetProgressBefore();
		progressType = 'before';
		progressBefore.set(1);
	});

	afterNavigate(() => {
		progressType = 'after';
		if ($progressBefore > 0) {
			resetProgressAfter();
			progressAfter.set(1);
		} else {
			progressAfter = tweened(1, {
				duration: completionTime
			});
		}
	});
</script>

<div
	style="transform: scaleX({(progressType === 'before' ? $progressBefore : $progressAfter) *
		100}%);"
	class="w-full absolute top-0 rounded-full origin-left h-4px bg-c-primary z-10
   pointer-events-none {progressType === 'after' ? 'transition-opacity' : ''} {(progressType ===
		'after' &&
		$progressAfter === 1) ||
	(progressType === 'before' && $progressBefore === 0)
		? 'opacity-0'
		: ''}"
/>
