import getSizingData from './getSizingData';
import calculateNodeHeight from './calculateNodeHeight';

interface TAutoResizeProps {
	minRows?: number;
	maxRows?: number;
}

export function autoresize(node: HTMLTextAreaElement, props?: TAutoResizeProps) {
	const { minRows, maxRows } = props || {};
	const resize = () => {
		const nodeSizingData = getSizingData(node);
		if (!nodeSizingData) {
			return;
		}
		const height = calculateNodeHeight(
			nodeSizingData,
			node.value || node.placeholder || 'x',
			minRows,
			maxRows
		);
		node.style.setProperty('height', `${height[0]}px`, 'important');
	};
	node.addEventListener('input', resize);
	node.addEventListener('focus', resize);
	node.addEventListener('blur', resize);
	window.addEventListener('resize', resize);
	resize();
	setTimeout(() => {
		resize();
	});
	return {
		destroy() {
			node.removeEventListener('input', resize);
			node.removeEventListener('focus', resize);
			node.removeEventListener('blur', resize);
			window.removeEventListener('resize', resize);
		}
	};
}
