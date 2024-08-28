import type winston from 'winston';

type TLogger =
	| winston.Logger
	| {
			info: typeof console.info;
			error: typeof console.error;
			warn: typeof console.warn;
	  };

export let logger: TLogger = {
	info: console.info,
	error: console.error,
	warn: console.warn
};

export function setLogger(newLogger: TLogger): void {
	logger = newLogger;
}

export function isKubeProbe(headers: Headers): boolean {
	const userAgent = headers.get('User-Agent');
	return userAgent && userAgent.includes('kube-probe') ? true : false;
}

type TableRow = [string, string];

export function asTable(data: TableRow[], width: number = 80): string {
	if (data.length === 0) return '';

	const maxPropLength = Math.max(...data.map(([prop]) => prop.length));
	const maxPossibleValueLength = width - maxPropLength - 3;
	const maxActualValueLength = Math.max(...data.map(([, value]) => value.length));
	const maxValueLength = Math.min(maxPossibleValueLength, maxActualValueLength); // Ensure positive value
	const maxLength = maxPropLength + maxValueLength + 3 + 1;
	let result = '';

	const dividerStart = '-'.repeat(maxLength - 7);
	const dividerEnd = '-'.repeat(maxLength);
	result += dividerStart + '\n';

	for (const [prop, value] of data) {
		const wrappedValue = wrapText(value, maxValueLength);
		const wrappedLines = wrappedValue.split('\n');

		for (let i = 0; i < wrappedLines.length; i++) {
			const line = wrappedLines[i];
			const propText = i === 0 ? prop.padEnd(maxPropLength, ' ') : ' '.repeat(maxPropLength);
			const lineStr = `${propText} | ${line.padEnd(maxValueLength, ' ')}`;
			result += lineStr + '\n';
		}
	}

	result += dividerEnd;
	return result;
}

function wrapText(text: string, maxLength: number): string {
	const lines: string[] = [];
	let currentLine = '';

	for (const char of text) {
		if (currentLine.length >= maxLength) {
			lines.push(currentLine);
			currentLine = '';
		}

		if (char === ' ' && currentLine.length === 0) {
			continue; // Skip leading spaces
		}

		currentLine += char;

		if (char === '\n') {
			lines.push(currentLine);
			currentLine = '';
		}
	}

	if (currentLine) {
		lines.push(currentLine);
	}

	return lines.join('\n');
}
