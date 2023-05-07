import { browser } from '$app/environment';
import { themeApp } from '$ts/stores/theme';
import { get } from 'svelte/store';

export function setBodyClasses() {
	const theme = get(themeApp);
	if (browser) {
		if (theme === 'light') {
			document.body.classList.add('theme-light');
			document.body.classList.remove('theme-dark');
		} else {
			document.body.classList.add('theme-dark');
			document.body.classList.remove('theme-light');
		}
	}
}
