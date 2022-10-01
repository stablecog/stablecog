export const parsedUrl = (str: string) => {
	const url = new URL(str);
	return url.hostname;
};
