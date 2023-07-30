export const getNumber = (name: string) => {
	const charactersArray = Array.from(name);
	let charactersCodesSum = 0;
	charactersArray.forEach((charactersArrayItem) => {
		return (charactersCodesSum += charactersArrayItem.charCodeAt(0));
	});
	return charactersCodesSum;
};
export const getModulus = (num: number, max: number) => {
	return num % max;
};
export const getDigit = (number: number, ntn: number) => {
	return Math.floor((number / Math.pow(10, ntn)) % 10);
};
export const getBoolean = (number: number, ntn: number) => {
	return !(getDigit(number, ntn) % 2);
};
export const getAngle = (x: number, y: number) => {
	return (Math.atan2(y, x) * 180) / Math.PI;
};
export const getUnit = (number: number, range: number, index?: number) => {
	let value = number % range;
	if (index && getDigit(number, index) % 2 === 0) {
		return -value;
	} else return value;
};
export const getRandomColor = (number: number, colors: string[], range: number) => {
	return colors[number % range];
};
export const getContrast = (hexcolor: string) => {
	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}
	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0, 2), 16);
	var g = parseInt(hexcolor.substr(2, 2), 16);
	var b = parseInt(hexcolor.substr(4, 2), 16);
	// Get YIQ ratio
	var yiq = (r * 299 + g * 587 + b * 114) / 1000;
	// Check contrast
	return yiq >= 128 ? 'black' : 'white';
};
// Source
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
export const getRandomId = () => {
	const array = [...Array(8)].map(() => getRandomInt(0, 255));
	return array.toString();
};
