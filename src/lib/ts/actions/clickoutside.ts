export function clickoutside(
	node: HTMLElement,
	{ callback, exclude, capture = true }: TClickoutsideProps
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

	document.addEventListener('click', onClick, capture);
	document.addEventListener('mousedown', onMouseDown, capture);
	return {
		destroy() {
			document.removeEventListener('click', onClick, capture);
			document.removeEventListener('mousedown', onMouseDown, capture);
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
