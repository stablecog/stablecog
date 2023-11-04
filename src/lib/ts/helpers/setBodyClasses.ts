import { browser } from '$app/environment';
import { isTouchscreen } from '$ts/stores/isTouchscreen';
import { themeApp } from '$ts/stores/theme';
import { get } from 'svelte/store';

export function setBodyClasses() {
	if (browser) {
		const theme = get(themeApp);
		const isTouch = get(isTouchscreen);
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (theme === 'light') {
			document.body.classList.add('theme-light');
			document.body.classList.remove('theme-dark');
			metaThemeColor?.setAttribute('content', '#E3DDEB');
		} else {
			document.body.classList.add('theme-dark');
			document.body.classList.remove('theme-light');
			metaThemeColor?.setAttribute('content', '#121217');
		}
		if (isTouch) {
			document.body.classList.remove('not-touch');
		} else {
			document.body.classList.add('not-touch');
		}
	}
}
