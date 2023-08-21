export function removeSpecialCharacters(input: string): string {
	return input.replace(/[.\s-_]/g, '');
}
