export function isValue<T>(value: T): value is T {
	return value !== undefined && value !== null && value !== '';
}
