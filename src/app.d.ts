// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

interface PlausibleObj {
	callback?: function;
	props?: { [key: string]: string };
}

interface Window {
	plausible: (goalName: string, obj?: PlausibleObj) => void;
	umami: (goalName: string) => void;
}

declare module '*.md' {
	// "unknown" would be more detailed depends on how you structure frontmatter
	const attributes: Record<string, unknown>;

	// When "Mode.TOC" is requested
	const toc: { level: string; content: string }[];

	// When "Mode.HTML" is requested
	const html: string;

	// When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
	import React from 'react';
	const ReactComponent: React.VFC;

	// When "Mode.Vue" is requested
	import { ComponentOptions, Component } from 'vue';
	const VueComponent: ComponentOptions;
	const VueComponentWith: (components: Record<string, Component>) => ComponentOptions;

	// Modify below per your usage
	export { attributes, toc, html, ReactComponent, VueComponent, VueComponentWith };
}
