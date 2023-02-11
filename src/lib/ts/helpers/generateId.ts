export const generateId = () => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const array = Array.from(bytes);
	const hexPairs = array.map((b) => b.toString(16).padStart(2, '0'));
	return hexPairs.join('');
};
