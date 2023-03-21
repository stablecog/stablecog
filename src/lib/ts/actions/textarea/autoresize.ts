import getSizingData from './getSizingData';
import calculateNodeHeight from './calculateNodeHeight';

interface TAutoResizeProps {
	minRows?: number;
	maxRows?: number;
	placeholder?: string;
}

export function autoresize(node: HTMLTextAreaElement, props: TAutoResizeProps) {
	let currentProps = props;

	const resize = (props: TAutoResizeProps) => {
		currentProps = props;
		const nodeSizingData = getSizingData(node);
		if (!nodeSizingData) {
			return;
		}
		const height = calculateNodeHeight(
			nodeSizingData,
			node.value || node.placeholder || 'x',
			props.minRows,
			props.maxRows
		);
		node.style.setProperty('height', `${height[0]}px`, 'important');
	};

	const resizeWithProps = () => resize(currentProps);
	resizeWithProps();

	node.addEventListener('input', resizeWithProps);
	node.addEventListener('focus', resizeWithProps);
	node.addEventListener('blur', resizeWithProps);
	window.addEventListener('resize', resizeWithProps);
	setTimeout(() => {
		resizeWithProps();
	});
	return {
		destroy() {
			node.removeEventListener('input', resizeWithProps);
			node.removeEventListener('focus', resizeWithProps);
			node.removeEventListener('blur', resizeWithProps);
			window.removeEventListener('resize', resizeWithProps);
		},
		update(props: TAutoResizeProps) {
			resize(props);
		}
	};
}
