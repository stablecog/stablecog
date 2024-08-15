import { browser } from '$app/environment';
import { isTouchscreen } from '$ts/stores/isTouchscreen';
import { themeApp } from '$ts/stores/theme';
import { get } from 'svelte/store';

export function setBodyClasses() {
	console.log('test');
	if (browser) {
		const theme = get(themeApp);
		const isTouch = get(isTouchscreen);
		const lightColor = '#E3DDEB';
		const darkColor = '#121217';
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		const content = metaThemeColor?.getAttribute('content');
		if (theme === 'light') {
			document.body.classList.add('theme-light');
			document.body.classList.remove('theme-dark');
			if (content !== lightColor) metaThemeColor?.setAttribute('content', lightColor);
		} else {
			document.body.classList.add('theme-dark');
			document.body.classList.remove('theme-light');
			if (content !== darkColor) metaThemeColor?.setAttribute('content', darkColor);
		}
		if (isTouch) {
			document.body.classList.remove('not-touch');
		} else {
			document.body.classList.add('not-touch');
		}
	}
}
