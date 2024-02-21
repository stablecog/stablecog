export function clickoutside(node: HTMLElement, props: TClickoutsideProps | undefined) {
	if (!props) return;
	let { callback, exclude, capture } = props;
	if (capture === undefined) capture = true;

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
	const tooltips = document.querySelectorAll('[role="tooltip"]');
	return (
		node !== event.target &&
		!node.contains(event.target as Node) &&
		!(exclude && exclude.some((e) => e && e.contains(event.target as Node))) &&
		!(exclude && exclude.some((e) => e && event.target === e)) &&
		!(
			tooltips &&
			tooltips.length > 0 &&
			[...tooltips].some((e) => e && e.contains(event.target as Node))
		)
	);
}

interface TClickoutsideProps {
	callback: () => void;
	exclude?: (HTMLElement | undefined)[];
	capture?: boolean;
}
