export const getGalleryMetaTagDescriptionFromPromptText = (promptText: string) => {
	return `Check out this generation on our gallery: "${capitalize(promptText.slice(0, 200))}${
		promptText.length > 200 ? '...' : ''
	}".`;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
