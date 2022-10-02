export const parseUrlStr = (url: string) => {
	if (url.startsWith('http://')) {
		return url.slice(7);
	} else if (url.startsWith('https://')) {
		return url.slice(8);
	} else return url;
};
