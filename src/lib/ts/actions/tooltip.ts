export function tooltip(
	node: HTMLElement,
	{
		wrapperClass,
		containerClass,
		indicatorClass,
		title,
		titleClass,
		description,
		descriptionClass,
		animationTime = 200,
		animateFrom,
		animateTo
	}: TTooltipProps
) {
	const tooltipWrapper = document.createElement('div');
	tooltipWrapper.style.zIndex = '50';
	tooltipWrapper.style.position = 'absolute';
	tooltipWrapper.style.paddingRight = '1rem';
	tooltipWrapper.style.pointerEvents = 'none';

	addClasses(tooltipWrapper, animateFrom);
	addClasses(tooltipWrapper, wrapperClass);

	if (indicatorClass) {
		const indicator = document.createElement('div');
		addClasses(indicator, indicatorClass);
		tooltipWrapper.appendChild(indicator);
	}

	const tooltipContainer = document.createElement('div');
	addClasses(tooltipContainer, containerClass);
	tooltipWrapper.appendChild(tooltipContainer);

	const titleElement = document.createElement('h3');
	titleElement.textContent = title;
	tooltipContainer.appendChild(titleElement);
	addClasses(titleElement, titleClass);

	if (description) {
		const descriptionElement = document.createElement('p');
		descriptionElement.textContent = description;
		addClasses(descriptionElement, descriptionClass);
		tooltipContainer.appendChild(descriptionElement);
	}

	let mouseLeaveTimeout: NodeJS.Timeout;

	const onMouseEnter = () => {
		clearTimeout(mouseLeaveTimeout);
		if (!document.body.contains(tooltipWrapper)) {
			const { left, top, height } = node.getBoundingClientRect();
			const scrollY = window.scrollY;
			tooltipWrapper.style.left = `${left}px`;
			tooltipWrapper.style.top = `${top + height + scrollY}px`;

			document.body.appendChild(tooltipWrapper);
			setTimeout(() => {
				addClasses(tooltipWrapper, animateTo);
				removeClasses(tooltipWrapper, animateFrom);
			});
		} else {
			addClasses(tooltipWrapper, animateTo);
			removeClasses(tooltipWrapper, animateFrom);
		}
	};

	const onMouseLeave = () => {
		if (tooltipWrapper) {
			addClasses(tooltipWrapper, animateFrom);
			removeClasses(tooltipWrapper, animateTo);
		}
		clearTimeout(mouseLeaveTimeout);
		mouseLeaveTimeout = setTimeout(() => {
			if (document.body.contains(tooltipWrapper)) {
				document.body.removeChild(tooltipWrapper);
			}
		}, animationTime);
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

function addClasses(element: HTMLElement, classes?: string) {
	if (classes) {
		const classesArray = classes.split(' ');
		if (classes.length > 0) {
			element.classList.add(...classesArray);
		}
	}
}

function removeClasses(element: HTMLElement, classes?: string) {
	if (classes) {
		const classesArray = classes.split(' ');
		if (classes.length > 0) {
			element.classList.remove(...classesArray);
		}
	}
}

interface TTooltipProps {
	wrapperClass?: string;
	containerClass?: string;
	indicatorClass?: string;
	title: string;
	titleClass: string;
	description?: string;
	descriptionClass: string;
	animationTime?: number;
	animateFrom?: string;
	animateTo?: string;
}
