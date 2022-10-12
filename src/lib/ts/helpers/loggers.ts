export function pLogGeneration(status: 'Started' | 'Succeeded' | 'Failed') {
	if (window.plausible) {
		window.plausible(`Generation | ${status}`);
	}
}
