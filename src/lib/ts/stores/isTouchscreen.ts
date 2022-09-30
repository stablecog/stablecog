import { browser } from '$app/environment';
import { readable } from 'svelte/store';

let _isTouchscreen = true;

export const isTouchscreen = readable<boolean>(_isTouchscreen, (set) => {
	if (browser) {
		document?.body.addEventListener('touchstart', handleTouch);
		document?.body.addEventListener('mousemove', disableTouch);
	}

	function handleTouch() {
		if (!_isTouchscreen) {
			_isTouchscreen = true;
			set(_isTouchscreen);
		}
	}

	function disableTouch() {
		const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (_isTouchscreen && !isTouchEnabled) {
			_isTouchscreen = false;
			set(_isTouchscreen);
		}
	}

	return () => {
		if (browser) {
			document?.body.removeEventListener('touchstart', handleTouch);
			document?.body.removeEventListener('mousemove', disableTouch);
		}
	};
});
