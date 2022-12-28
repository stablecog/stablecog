export const formattedNow = (): string => {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth();
	const monthName = monthsShort[month];
	const day = now.getUTCDate();
	const hour = now.getUTCHours();
	const min = now.getUTCMinutes();
	const sec = now.getUTCSeconds();

	return `${monthName} ${day}, ${year} • ${dd(hour)}:${dd(min)}:${dd(sec)} (UTC)`;
};

const dd = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

// months of the year
export const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const monthsShort = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];
