const promptLen = 150;

export const getGalleryMetaTagDescriptionFromPromptText = (promptText: string) => {
	return `Check out this generation on Stablecog's gallery: "${shortenString(promptText, promptLen)}".`;
};

export const getOutputOnProfileMetaTagDescriptionFromPromptText = (
	promptText: string,
	username: string
) => {
	return `Check out this generation from @${username} on Stablecog's gallery: "${shortenString(promptText, promptLen)}".`;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function shortenString(s: string, l = 40): string {
	return s.length > l ? s.substring(0, l) + '...' : s;
}

export function shortenAndCapitalizeString(s: string, l = 40): string {
	return capitalize(shortenString(s, l));
}
