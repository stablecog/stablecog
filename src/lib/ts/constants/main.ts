import type { TServerHealth, TTab } from '$ts/types/main';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 30;
export const canonicalUrl = 'https://stablecog.com';
export const defaultServerHealth: TServerHealth = 'loading';

export const widthTabs: TTab[] = [
	{ label: '256', value: '256' },
	{ label: '512', value: '512' },
	{ label: '768', value: '768' }
	/* { label: '1024', value: '1024' } */
];
export const heightTabs: TTab[] = [
	{ label: '256', value: '256' },
	{ label: '512', value: '512' },
	{ label: '768', value: '768' }
	/* { label: '1024', value: '1024' } */
];
