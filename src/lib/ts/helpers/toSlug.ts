export function toSlug(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}
