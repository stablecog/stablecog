export function tooltip(
	node: HTMLElement,
	{
		containerClass,
		indicatorClass,
		title,
		titleClass,
		description,
		descriptionClass
	}: TTooltipProps
) {
	const tooltipWrapper = document.createElement('div');
	tooltipWrapper.style.zIndex = '50';
	tooltipWrapper.style.position = 'absolute';
	tooltipWrapper.style.paddingRight = '1rem';

	if (indicatorClass) {
		const indicator = document.createElement('div');
		const indicatorClasses = indicatorClass.split(' ');
		if (indicatorClasses.length > 0) {
			indicator.classList.add(...indicatorClasses);
		}
		tooltipWrapper.appendChild(indicator);
	}

	const tooltipContainer = document.createElement('div');
	if (containerClass) {
		const containerClasses = containerClass.split(' ');
		if (containerClasses.length > 0) {
			tooltipContainer.classList.add(...containerClasses);
		}
	}
	tooltipWrapper.appendChild(tooltipContainer);

	const titleElement = document.createElement('h3');
	titleElement.textContent = title;
	tooltipContainer.appendChild(titleElement);
	if (titleClass) {
		const titleClasses = titleClass.split(' ');
		if (titleClasses.length > 0) {
			titleElement.classList.add(...titleClasses);
		}
	}

	if (description) {
		const descriptionElement = document.createElement('p');
		descriptionElement.textContent = description;
		tooltipContainer.appendChild(descriptionElement);
		if (descriptionClass) {
			const descriptionClasses = descriptionClass.split(' ');
			if (descriptionClasses.length > 0) {
				descriptionElement.classList.add(...descriptionClasses);
			}
		}
	}

	const onMouseEnter = () => {
		const { left, top, width, height } = node.getBoundingClientRect();
		tooltipWrapper.style.left = `${left}px`;
		tooltipWrapper.style.top = `${top + height}px`;

		document.body.appendChild(tooltipWrapper);
	};

	const onMouseLeave = () => {
		// if body has the child
		if (document.body.contains(tooltipWrapper)) {
			document.body.removeChild(tooltipWrapper);
		}
	};

	node.addEventListener('mouseenter', onMouseEnter, false);
	node.addEventListener('mouseleave', onMouseLeave, false);
	window.addEventListener('resize', onMouseLeave, false);
	window.addEventListener('scroll', onMouseLeave, false);
	return {
		destroy() {
			node.removeEventListener('mouseenter', onMouseEnter, false);
			node.removeEventListener('mouseleave', onMouseLeave, false);
			window.removeEventListener('resize', onMouseLeave, false);
			window.removeEventListener('scroll', onMouseLeave, false);
		}
	};
}

interface TTooltipProps {
	containerClass?: string;
	indicatorClass?: string;
	title: string;
	titleClass: string;
	description?: string;
	descriptionClass: string;
}
