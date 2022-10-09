import BezierEasing from 'bezier-easing';

export const easingApp = (t: number): number => {
	const bezier = BezierEasing(0.4, 0, 0.2, 1);
	return bezier(t);
};
