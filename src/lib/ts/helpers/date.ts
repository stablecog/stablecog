export function getDateString(date: Date): string {
	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	const monthString = month < 10 ? `0${month}` : month;
	const day = date.getDate();
	const dayString = day < 10 ? `0${day}` : day;
	return `${dayString}.${monthString}.${year}`;
}
