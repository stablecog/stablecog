import type { TTab } from '$ts/types/main';

export const availableWidths = ['384', '512', '640', '768'] as const;
export type TAvailableWidth = typeof availableWidths[number];
export const widthTabs: TTab<TAvailableWidth>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const widthDefault: TAvailableWidth = '512';

export const availableHeights = ['384', '512', '640', '768'] as const;
export type TAvailableHeight = typeof availableWidths[number];
export const heightTabs: TTab<TAvailableHeight>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const heightDefault: TAvailableHeight = '768';
