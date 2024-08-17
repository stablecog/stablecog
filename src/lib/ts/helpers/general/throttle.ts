type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limitMs: number
): ThrottledFunction<T> {
	let lastFunc: ReturnType<typeof setTimeout>;
	let lastRan: number;

	return function (...args: Parameters<T>) {
		if (!lastRan) {
			func(...args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(
				() => {
					if (Date.now() - lastRan >= limitMs) {
						func(...args);
						lastRan = Date.now();
					}
				},
				limitMs - (Date.now() - lastRan)
			);
		}
	};
}
