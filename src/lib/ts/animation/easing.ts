import BezierEasing from 'bezier-easing';

export const easingApp = (t: number): number => {
	const bezier = BezierEasing(0.4, 0, 0.2, 1);
	return bezier(t);
};

export const easingBounceOut = (t: number): number => {
	const bezier = BezierEasing(0.15, 1.5, 0.5, 1);
	return bezier(t);
};
