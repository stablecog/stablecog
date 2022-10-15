export function pLogGeneration(status: 'Started' | 'Succeeded' | 'Failed') {
	if (window.plausible) {
		window.plausible(`Generation | ${status}`);
	}
}

export function uLogGeneration(status: 'Started' | 'Succeeded' | 'Failed') {
	if (window.umami) {
		window.umami(`Generation | ${status}`);
	}
}
