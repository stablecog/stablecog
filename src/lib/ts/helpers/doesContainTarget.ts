export const doesContainTarget = (target: EventTarget | null, elements: HTMLElement[]) => {
	const targetNode = target as Node;
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (targetNode === element || element.contains(targetNode)) {
			return true;
		}
	}
	return false;
};
