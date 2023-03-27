export function clickoutside(
	node: HTMLElement,
	{ callback, exclude }: { callback: () => void; exclude?: HTMLElement | undefined }
) {
	let startedFromOutside = false;
	function onMouseDown(event: Event) {
		if (isntInside(node, event, exclude)) {
			startedFromOutside = true;
		}
	}
	function onClick(event: Event) {
		if (isntInside(node, event, exclude) && startedFromOutside) {
			callback();
			startedFromOutside = false;
		}
	}

	function onFocus(event: Event) {
		if (isntInside(node, event, exclude)) {
			callback();
		}
	}

	document.addEventListener('click', onClick, true);
	document.addEventListener('mousedown', onMouseDown, true);
	document.addEventListener('focus', onFocus, true);
	return {
		destroy() {
			document.removeEventListener('click', onClick, true);
			document.removeEventListener('mousedown', onMouseDown, true);
			document.removeEventListener('focus', onFocus, true);
		}
	};
}

function isntInside(node: HTMLElement, event: Event, exclude?: HTMLElement | undefined) {
	return (
		node !== event.target &&
		!node.contains(event.target as Node) &&
		!(exclude && exclude.contains(event.target as Node)) &&
		!(exclude && exclude === event.target)
	);
}
