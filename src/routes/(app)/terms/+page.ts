import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
	const mdImport = import.meta.glob('$md/terms.md');
	const mdObj = (await mdImport['/src/lib/md/terms.md']()) as {
		default: ConstructorOfATypedSvelteComponent;
	};
	return {
		content: mdObj.default
	};
};
