export function getTimeString(val: string) {
	const date = new Date(Number(val) / 1000000);
	const now = new Date();
	const timeString =
		date.toLocaleTimeString(undefined, { hour12: false }) +
		'.' +
		date.getMilliseconds().toString().slice(0, 2).padEnd(2, '0');
	const dateString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
	const isOlderThan24Hours = now.getTime() - date.getTime() > 24 * 60 * 60 * 1000;
	const notToday = now.getDate() !== date.getDate();
	let finalString = '';
	if (isOlderThan24Hours || notToday) {
		finalString += `${dateString} | `;
	}
	finalString += timeString;
	return finalString;
}

export function getLastTimestamp(logRows: TLogRow[]) {
	if (logRows.length === 0) {
		return 0;
	}
	const lastValue = logRows[logRows.length - 1].value;
	return Number(lastValue[0]);
}

type Stream = {
	logger: string;
	severity: string;
	worker_name: string;
	application: string;
};

export type ValueTuple = [string, string];

export type TLogRow = {
	stream: Stream;
	value: ValueTuple;
};

export type ReceivedMessage = {
	streams: {
		stream: Stream;
		values: ValueTuple[];
	}[];
};

export function areArraysMatching<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (!b.includes(a[i])) {
			return false;
		}
		if (!a.includes(b[i])) {
			return false;
		}
	}
	return true;
}
