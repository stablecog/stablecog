export function galleryPreviewUrlFromGenerationId(baseUrl: string, generationId: string) {
	return `${baseUrl}/api/og/gallery/generation/${generationId}.jpeg`;
}
