export function convertToDBTimeString(timestamp: number): string {
	const date = new Date(timestamp);
	const year = date.getUTCFullYear().toString().padStart(4, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = date.getUTCDate().toString().padStart(2, '0');
	const hour = date.getUTCHours().toString().padStart(2, '0');
	const minute = date.getUTCMinutes().toString().padStart(2, '0');
	const second = date.getUTCSeconds().toString().padStart(2, '0');
	const millisecond = date.getUTCMilliseconds().toString().padStart(6, '0');

	const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;

	return formattedDate;
}
