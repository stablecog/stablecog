import { browser } from '$app/environment';
import { isTouchscreen } from '$ts/stores/isTouchscreen';
import { themeApp } from '$ts/stores/theme';
import { get } from 'svelte/store';

export function setBodyClasses() {
	if (browser) {
		const theme = get(themeApp);
		const isTouch = get(isTouchscreen);
		if (theme === 'light') {
			document.body.classList.add('theme-light');
			document.body.classList.remove('theme-dark');
		} else {
			document.body.classList.add('theme-dark');
			document.body.classList.remove('theme-light');
		}
		if (isTouch) {
			document.body.classList.remove('not-touch');
		} else {
			document.body.classList.add('not-touch');
		}
	}
}
