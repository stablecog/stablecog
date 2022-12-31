import { browser } from '$app/environment';

export function setCookie(v: string) {
	if (!browser) return;
	try {
		document.cookie = `${v}; path=/; samesite=strict; max-age=31536000; secure = true;`;
	} catch (error) {
		console.log(error);
	}
}
