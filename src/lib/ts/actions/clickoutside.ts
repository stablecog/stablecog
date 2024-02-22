export function clickoutside(node: HTMLElement, props: TClickoutsideProps | undefined) {
	if (!props) return;
	let { callback, exclude, capture, triggerOnBlur } = props;
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

	// New function to handle focus changes
	function onFocusChange(event: FocusEvent) {
		const newFocus = event.target as Node;
		// Check if the new focus is outside the node and not on an excluded element
		if (!node.contains(newFocus) && !isExcluded(newFocus, exclude)) {
			callback();
		}
	}

	document.addEventListener('click', onClick, capture);
	document.addEventListener('mousedown', onMouseDown, capture);
	if (triggerOnBlur) {
		// Listen for any focus changes in the document
		document.addEventListener('focusin', onFocusChange, true);
	}

	return {
		destroy() {
			document.removeEventListener('click', onClick, capture);
			document.removeEventListener('mousedown', onMouseDown, capture);
			if (triggerOnBlur) {
				document.removeEventListener('focusin', onFocusChange, true);
			}
		},
		update(newProps: TClickoutsideProps) {
			exclude = newProps.exclude;
			if (newProps.triggerOnBlur !== triggerOnBlur) {
				triggerOnBlur = newProps.triggerOnBlur;
				if (triggerOnBlur) {
					document.addEventListener('focusin', onFocusChange, true);
				} else {
					document.removeEventListener('focusin', onFocusChange, true);
				}
			}
		}
	};
}

function isntInside(node: HTMLElement, event: Event, exclude?: (HTMLElement | undefined)[]) {
	return !isExcluded(event.target as Node, exclude) && !node.contains(event.target as Node);
}

// Helper function to check if the target is in the excluded elements
function isExcluded(target: Node, exclude?: (HTMLElement | undefined)[]) {
	return (
		exclude &&
		exclude.some(
			(excludedElement) =>
				excludedElement && (excludedElement === target || excludedElement.contains(target))
		)
	);
}

interface TClickoutsideProps {
	callback: () => void;
	exclude?: (HTMLElement | undefined)[];
	capture?: boolean;
	triggerOnBlur?: boolean; // New optional parameter
}
