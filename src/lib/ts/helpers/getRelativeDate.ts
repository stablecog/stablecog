export function getRelativeDate(
	date: string | number | undefined,
	now: number | undefined = Date.now()
) {
	if (date === undefined || (typeof date === 'number' && isNaN(date))) return 'Unknown';
	const d = new Date(date);
	const rtf1 = new Intl.RelativeTimeFormat('en-US', { style: 'short' });
	const seconds = (d.getTime() - now) / 1000;
	const secondsRounded = Math.round(seconds);
	if (Math.abs(secondsRounded) < 60) {
		return rtf1.format(secondsRounded, 'second');
	}
	const minutes = seconds / 60;
	const minutesRounded = Math.round(minutes);
	if (Math.abs(minutesRounded) < 60) {
		return rtf1.format(minutesRounded, 'minute');
	}
	const hours = minutes / 60;
	const hoursRounded = Math.round(hours);
	if (Math.abs(hoursRounded) < 24) {
		return rtf1.format(hoursRounded, 'hour');
	}
	const days = hours / 24;
	const daysRounded = Math.round(days);
	return rtf1.format(daysRounded, 'day');
}
