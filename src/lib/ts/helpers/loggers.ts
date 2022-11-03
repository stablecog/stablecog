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

export function pLogUpscale(status: 'Started' | 'Succeeded' | 'Failed') {
	if (window.plausible) {
		window.plausible(`Upscale | ${status}`);
	}
}

export function uLogUpscale(status: 'Started' | 'Succeeded' | 'Failed') {
	if (window.umami) {
		window.umami(`Upscale | ${status}`);
	}
}

export function pLogSubmitToGallery(status: 'On' | 'Off') {
	if (window.plausible) {
		window.plausible(`Submit to Gallery | ${status}`);
	}
}

export function uLogSubmitToGallery(status: 'On' | 'Off') {
	if (window.umami) {
		window.umami(`Submit to Gallery | ${status}`);
	}
}
