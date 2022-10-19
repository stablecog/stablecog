export function tooltip(
	node: HTMLElement,
	{
		wrapperClass,
		containerClass,
		containerAlign,
		indicatorClass,
		indicatorInnerClass,
		rowClass,
		title,
		titleClass,
		description,
		descriptionClass,
		animationTime = 200,
		animateFrom,
		animateTo,
		rows
	}: TTooltipProps
) {
	const tooltipWrapper = document.createElement('div');
	const indicator = document.createElement('div');
	const tooltipContainer = document.createElement('div');
	tooltipWrapper.style.zIndex = '9999';
	tooltipWrapper.style.position = 'absolute';
	tooltipWrapper.style.pointerEvents = 'none';
	tooltipWrapper.style.backgroundColor = 'blue';

	addClasses(tooltipWrapper, animateFrom);
	addClasses(tooltipWrapper, wrapperClass);

	if (indicatorClass) {
		indicator.style.position = 'absolute';
		addClasses(indicator, indicatorClass);
		if (indicatorInnerClass) {
			const indicatorInner = document.createElement('div');
			addClasses(indicatorInner, indicatorInnerClass);
			indicator.appendChild(indicatorInner);
		}
		tooltipWrapper.appendChild(indicator);
	}

	tooltipContainer.style.position = 'absolute';
	addClasses(tooltipContainer, containerClass);
	tooltipWrapper.appendChild(tooltipContainer);

	if (rows) {
		rows.forEach((row) => {
			const rowWrapper = document.createElement('div');

			const titleElement = document.createElement('p');
			titleElement.textContent = row.key;
			addClasses(titleElement, titleClass);
			rowWrapper.appendChild(titleElement);

			const descriptionElement = document.createElement('p');
			descriptionElement.textContent = row.value;
			addClasses(descriptionElement, descriptionClass);
			rowWrapper.appendChild(descriptionElement);

			addClasses(rowWrapper, rowClass);
			tooltipContainer.appendChild(rowWrapper);
		});
	} else {
		if (title) {
			const titleElement = document.createElement('h3');
			titleElement.textContent = title;
			addClasses(titleElement, titleClass);
			tooltipContainer.appendChild(titleElement);
		}

		if (description) {
			const descriptionElement = document.createElement('p');
			descriptionElement.textContent = description;
			addClasses(descriptionElement, descriptionClass);
			tooltipContainer.appendChild(descriptionElement);
		}
	}

	let mouseLeaveTimeout: NodeJS.Timeout;

	const onMouseEnter = () => {
		clearTimeout(mouseLeaveTimeout);
		if (!document.body.contains(tooltipWrapper)) {
			document.body.appendChild(tooltipWrapper);
			const { left: nodeL, top: nodeT, height: nodeH, width: nodeW } = node.getBoundingClientRect();
			const { height: indicatorH, width: indicatorW } = indicator.getBoundingClientRect();
			const { width: containerW } = tooltipContainer.getBoundingClientRect();
			const scrollY = window.scrollY;
			tooltipWrapper.style.left = `${nodeL + nodeW / 2 - indicatorW / 2}px`;
			tooltipWrapper.style.top = `${nodeT + nodeH + scrollY}px`;
			tooltipContainer.style.marginTop = `${indicatorH}px`;
			tooltipContainer.style.marginLeft = `${
				containerAlign === 'left' ? -indicatorW : -containerW / 2 + indicatorW / 2
			}px`;
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
			onMouseLeave();
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

export interface TTooltipProps {
	wrapperClass?: string;
	containerClass?: string;
	containerAlign?: 'left' | 'center';
	indicatorClass?: string;
	indicatorInnerClass?: string;
	title?: string;
	titleClass: string;
	rowClass?: string;
	description?: string;
	descriptionClass: string;
	animationTime?: number;
	animateFrom?: string;
	animateTo?: string;
	rows?: TRow[];
}

interface TRow {
	key: string;
	value: string;
}
