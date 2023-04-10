export function tooltip(
	node: HTMLElement,
	{
		parentContainerId,
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
	const padding = 16;
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

	const addStyles = async () => {
		const {
			left: nodeL,
			top: nodeT,
			height: nodeH,
			width: nodeW,
			bottom: nodeB
		} = node.getBoundingClientRect();
		const { height: indicatorH, width: indicatorW } = indicator.getBoundingClientRect();
		const { width: containerW, height: containerH } = tooltipContainer.getBoundingClientRect();
		const scrollY = window.scrollY;
		tooltipWrapper.style.left = `${nodeL + nodeW / 2 - indicatorW / 2}px`;
		tooltipWrapper.style.top = `${nodeT + nodeH + scrollY}px`;
		tooltipContainer.style.marginTop = `${indicatorH}px`;
		const leftDistance = nodeL + nodeW / 2 - containerW / 2;
		const rightDistance = -(nodeL + nodeW / 2 + containerW / 2 - window.innerWidth);
		let newMarginLeft = containerAlign === 'left' ? -indicatorW : -containerW / 2 + indicatorW / 2;
		if (leftDistance < padding && containerAlign !== 'left') {
			newMarginLeft = newMarginLeft - (leftDistance - padding);
		} else if (rightDistance < padding && containerAlign !== 'right') {
			newMarginLeft = newMarginLeft + (rightDistance - padding);
		}
		tooltipContainer.style.marginLeft = `${newMarginLeft}px`;
		const bottomDistance = window.innerHeight - (nodeB + indicatorH + containerH);
		if (bottomDistance < padding) {
			const translateFix = 4;
			const wrapperNegativeMt = 1;
			let newMarginTop = -(indicatorH + containerH + nodeH - translateFix) + wrapperNegativeMt;
			tooltipWrapper.style.marginTop = `${newMarginTop}px`;
			indicator.style.marginTop = `${containerH - translateFix}px`;
			indicator.style.zIndex = '1';
		}
	};

	const removeStyles = async () => {
		tooltipWrapper.style.left = '';
		tooltipWrapper.style.top = '';
		tooltipContainer.style.marginTop = '';
		tooltipContainer.style.marginLeft = '';
		tooltipWrapper.style.marginTop = '';
		indicator.style.marginTop = '';
		indicator.style.zIndex = '';
	};

	const onMouseEnter = async () => {
		console.log('onMouseEnter');
		clearTimeout(mouseLeaveTimeout);
		if (!document.getElementById(`${parentContainerId}`)?.contains(tooltipWrapper)) {
			document.getElementById(`${parentContainerId}`)?.appendChild(tooltipWrapper);
			addStyles();
			setTimeout(() => {
				addClasses(tooltipWrapper, animateTo);
				removeClasses(tooltipWrapper, animateFrom);
			});
		} else {
			addClasses(tooltipWrapper, animateTo);
			removeClasses(tooltipWrapper, animateFrom);
		}
	};

	const onMouseLeave = async () => {
		if (tooltipWrapper) {
			addClasses(tooltipWrapper, animateFrom);
			removeClasses(tooltipWrapper, animateTo);
		}
		clearTimeout(mouseLeaveTimeout);
		mouseLeaveTimeout = setTimeout(async () => {
			if (document.getElementById(`${parentContainerId}`)?.contains(tooltipWrapper)) {
				document.getElementById(`${parentContainerId}`)?.removeChild(tooltipWrapper);
				removeStyles();
			}
		}, animationTime);
	};

	node.addEventListener('mouseenter', onMouseEnter, false);
	node.addEventListener('mouseleave', onMouseLeave, false);
	node.addEventListener('click', onMouseEnter, false);
	window.addEventListener('resize', onMouseLeave, false);
	window.addEventListener('scroll', onMouseLeave, true);

	return {
		destroy() {
			onMouseLeave();
			node.removeEventListener('mouseenter', onMouseEnter, false);
			node.removeEventListener('mouseleave', onMouseLeave, false);
			node.removeEventListener('click', onMouseEnter, false);
			window.removeEventListener('resize', onMouseLeave, false);
			window.removeEventListener('scroll', onMouseLeave, true);
		},
		update(newProps: TTooltipProps) {
			tooltipContainer.innerHTML = '';
			const rows = newProps.rows;
			const title = newProps.title;
			const description = newProps.description;
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
	parentContainerId: string;
	wrapperClass?: string;
	containerClass?: string;
	containerAlign?: 'left' | 'center' | 'right';
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

export interface TRow {
	key: string;
	value: string;
}
