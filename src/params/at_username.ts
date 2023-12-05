/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return /^@.*/.test(param);
}
