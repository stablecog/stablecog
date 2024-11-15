import { browser } from '$app/environment';
import { readable } from 'svelte/store';

function detectTouchDevice() {
	if (!browser) return false;
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export const isTouchscreen = readable<boolean>(detectTouchDevice(), (set) => {
	if (!browser) return;

	let _isTouchscreen = detectTouchDevice();

	function handleResize() {
		const isTouchEnabled = detectTouchDevice();
		if (_isTouchscreen !== isTouchEnabled) {
			_isTouchscreen = isTouchEnabled;
			set(_isTouchscreen);
		}
		updateBodyClass(_isTouchscreen);
	}

	function updateBodyClass(isTouch: boolean) {
		document.body.classList.toggle('not-touch', !isTouch);
	}

	// Initial class update
	updateBodyClass(_isTouchscreen);

	// Debounced resize listener
	const debounceTimeout = 200;
	let timeoutId: NodeJS.Timeout | null = null;

	const debouncedResize = () => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => handleResize(), debounceTimeout);
	};

	window.addEventListener('resize', debouncedResize);

	// Cleanup function
	return () => {
		if (browser) {
			if (timeoutId) clearTimeout(timeoutId);
			window.removeEventListener('resize', debouncedResize);
		}
	};
});
