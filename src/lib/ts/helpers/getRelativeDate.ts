export function getRelativeDate({
	date,
	now = Date.now(),
	decimals = 0,
	locale
}: {
	date: string | number | undefined;
	now?: number;
	decimals?: number;
	locale: Locales;
}) {
	if (date === undefined || (typeof date === 'number' && isNaN(date))) return 'Unknown';
	const d = new Date(date);
	const rtf1 = new Intl.RelativeTimeFormat(locale, { style: 'short' });
	const seconds = (d.getTime() - now) / 1000;
	const secondsRounded = Math.round(seconds);
	if (Math.abs(secondsRounded) < 60) {
		return rtf1.format(secondsRounded, 'second');
	}
	const minutes = seconds / 60;
	const minutesRounded = Math.round(minutes * Math.pow(10, decimals)) / Math.pow(10, decimals);
	if (Math.abs(minutesRounded) < 60) {
		return rtf1.format(minutesRounded, 'minute');
	}
	const hours = minutes / 60;
	const hoursRounded = Math.round(hours * Math.pow(10, decimals)) / Math.pow(10, decimals);
	if (Math.abs(hoursRounded) < 24) {
		return rtf1.format(hoursRounded, 'hour');
	}
	const days = hours / 24;
	const daysRounded = Math.round(days * Math.pow(10, decimals)) / Math.pow(10, decimals);
	if (Math.abs(daysRounded) < 30) {
		return rtf1.format(daysRounded, 'day');
	}
	const months = days / 30;
	const monthsRounded = Math.round(months * Math.pow(10, decimals)) / Math.pow(10, decimals);
	if (Math.abs(monthsRounded) < 12) {
		return rtf1.format(monthsRounded, 'month');
	}
	const years = days / 365;
	const yearsRounded = Math.round(years * Math.pow(10, decimals)) / Math.pow(10, decimals);
	return rtf1.format(yearsRounded, 'year');
}
