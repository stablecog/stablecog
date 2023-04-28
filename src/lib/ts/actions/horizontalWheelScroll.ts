export const horizontalWheelScroll = (node: HTMLElement) => {
	node.addEventListener('mousewheel', (e) => {
		e.preventDefault();
		node.scrollLeft += getNormalizedWheelDistance(e);
	});
};

function getNormalizedWheelDistance(e: Event) {
	// @ts-ignore
	const [w, d] = [e.wheelDelta, e.detail];
	if (d) {
		return -d / 3; // Firefox;
	}
	// IE, Safari, Chrome & other browsers
	return w / 120;
}
