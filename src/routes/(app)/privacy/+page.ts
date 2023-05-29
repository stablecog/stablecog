import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
	const mdImport = import.meta.glob('$md/privacy.md');
	const mdObj = (await mdImport['/src/lib/md/privacy.md']()) as {
		default: ConstructorOfATypedSvelteComponent;
	};
	return {
		content: mdObj.default
	};
};
