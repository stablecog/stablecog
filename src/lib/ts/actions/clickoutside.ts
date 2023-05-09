export function clickoutside(
	node: HTMLElement,
	{ callback, exclude, capture = false }: TClickoutsideProps
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

	document.addEventListener('click', onClick, capture);
	document.addEventListener('mousedown', onMouseDown, capture);
	document.addEventListener('focus', onFocus, capture);
	return {
		destroy() {
			document.removeEventListener('click', onClick, capture);
			document.removeEventListener('mousedown', onMouseDown, capture);
			document.removeEventListener('focus', onFocus, capture);
		},
		update(newProps: TClickoutsideProps) {
			exclude = newProps.exclude;
		}
	};
}

function isntInside(node: HTMLElement, event: Event, exclude?: (HTMLElement | undefined)[]) {
	return (
		node !== event.target &&
		!node.contains(event.target as Node) &&
		!(exclude && exclude.some((e) => e && e.contains(event.target as Node))) &&
		!(exclude && exclude.some((e) => e && event.target === e))
	);
}

interface TClickoutsideProps {
	callback: () => void;
	exclude?: (HTMLElement | undefined)[];
	capture?: boolean;
}
