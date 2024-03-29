import LL from '$i18n/i18n-svelte';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';

const aspectRatioRounding = Math.pow(10, 3);

export const availableWidths = [
	'320',
	'328',
	'384',
	'428',
	'432',
	'472',
	'480',
	'512',
	'576',
	'608',
	'640',
	'672',
	'720',
	'760',
	'768',
	'784',
	'800',
	'832',
	'840',
	'896',
	'912',
	'1024',
	'1120',
	'1128',
	'1152',
	'1248',
	'1280',
	'1536'
] as const;
export type TAvailableWidth = (typeof availableWidths)[number];
export const widthTabs: TTab<TAvailableWidth>[] = [
	{ label: '320', value: '320' },
	{ label: '384', value: '384' },
	{ label: '480', value: '480' },
	{ label: '512', value: '512' },
	{ label: '576', value: '576' },
	{ label: '608', value: '608' },
	{ label: '640', value: '640' },
	{ label: '672', value: '672' },
	{ label: '720', value: '720' },
	{ label: '768', value: '768' },
	{ label: '800', value: '800' },
	{ label: '832', value: '832' },
	{ label: '840', value: '840' },
	{ label: '896', value: '896' },
	{ label: '912', value: '912' },
	{ label: '1024', value: '1024' },
	{ label: '1120', value: '1120' },
	{ label: '1128', value: '1128' },
	{ label: '1152', value: '1152' },
	{ label: '1248', value: '1248' },
	{ label: '1280', value: '1280' },
	{ label: '1536', value: '1536' }
];
export const widthDefault: TAvailableWidth = '832';

export const availableHeights = [
	'320',
	'328',
	'384',
	'428',
	'432',
	'472',
	'480',
	'512',
	'576',
	'608',
	'640',
	'672',
	'720',
	'760',
	'768',
	'784',
	'800',
	'832',
	'840',
	'896',
	'912',
	'1024',
	'1120',
	'1128',
	'1152',
	'1248',
	'1280',
	'1536'
] as const;
export type TAvailableHeight = (typeof availableWidths)[number];
export const heightTabs: TTab<TAvailableHeight>[] = [
	{ label: '320', value: '320' },
	{ label: '384', value: '384' },
	{ label: '480', value: '480' },
	{ label: '512', value: '512' },
	{ label: '576', value: '576' },
	{ label: '608', value: '608' },
	{ label: '640', value: '640' },
	{ label: '672', value: '672' },
	{ label: '720', value: '720' },
	{ label: '768', value: '768' },
	{ label: '800', value: '800' },
	{ label: '832', value: '832' },
	{ label: '840', value: '840' },
	{ label: '896', value: '896' },
	{ label: '912', value: '912' },
	{ label: '1024', value: '1024' },
	{ label: '1120', value: '1120' },
	{ label: '1128', value: '1128' },
	{ label: '1152', value: '1152' },
	{ label: '1248', value: '1248' },
	{ label: '1280', value: '1280' },
	{ label: '1536', value: '1536' }
];
export const heightDefault: TAvailableHeight = '1248';

export const availableAspectRatios = ['1:1', '4:5', '2:3', '3:2', '9:16', '16:9', '2.4:1'] as const;
export const availableAspectRatioValues = availableAspectRatios.map((ratio) => {
	const [width, height] = ratio.split(':');
	return aspectRatioRounded(parseFloat(width) / parseFloat(height));
});

export type TAvailableAspectRatio = (typeof availableAspectRatios)[number];
export const aspectRatioTabs: TTab<TAvailableAspectRatio>[] = [
	{ label: '1:1', value: '1:1' },
	{ label: '4:5', value: '4:5' },
	{ label: '2:3', value: '2:3' },
	{ label: '3:2', value: '3:2' },
	{ label: '9:16', value: '9:16' },
	{ label: '16:9', value: '16:9' },
	{ label: '2.4:1', value: '2.4:1' }
];
export const aspectRatioDropdownItems = derived<
	[Readable<TranslationFunctions>],
	TTab<TAvailableAspectRatio>[]
>([LL], ([$LL]) => {
	const tabs: TTab<TAvailableAspectRatio>[] = [
		{ label: $LL.Home.AspectRatioDropdown.Options.Square(), value: '1:1' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Portrait(), value: '2:3' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Landscape(), value: '3:2' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Mobile(), value: '9:16' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Desktop(), value: '16:9' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Squarish(), value: '4:5' },
		{ label: $LL.Home.AspectRatioDropdown.Options.Anamorphic(), value: '2.4:1' }
	];
	return tabs;
});
export const aspectRatioDefault: TAvailableAspectRatio = '2:3';

const square = {
	small: {
		width: '512',
		height: '512'
	},
	medium: {
		width: '768',
		height: '768'
	},
	large: {
		width: '1024',
		height: '1024'
	}
} as const;

const portrait = {
	small: {
		width: '512',
		height: '768'
	},
	medium: {
		width: '608',
		height: '912'
	},
	large: {
		width: '832',
		height: '1248'
	}
} as const;

const landscape = {
	small: {
		width: '768',
		height: '512'
	},
	medium: {
		width: '912',
		height: '608'
	},
	large: {
		width: '1248',
		height: '832'
	}
} as const;

const mobile = {
	small: {
		width: '432',
		height: '768'
	},
	medium: {
		width: '576',
		height: '1024'
	},
	large: {
		width: '720',
		height: '1280'
	}
} as const;

const desktop = {
	small: {
		width: '768',
		height: '432'
	},
	medium: {
		width: '1024',
		height: '576'
	},
	large: {
		width: '1280',
		height: '720'
	}
} as const;

const squarish = {
	small: {
		width: '512',
		height: '640'
	},
	medium: {
		width: '672',
		height: '840'
	},
	large: {
		width: '896',
		height: '1120'
	}
} as const;

const anamorphic = {
	small: {
		width: '768',
		height: '320'
	},
	medium: {
		width: '1152',
		height: '480'
	},
	large: {
		width: '1536',
		height: '640'
	}
} as const;

export const aspectRatioToImageSize: {
	[key in TAvailableAspectRatio]: {
		[key: string]: {
			width: TAvailableWidth;
			height: TAvailableHeight;
		};
	};
} = {
	'1:1': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': square.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': square.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': square.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': square.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': square.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': square.medium,
		default: square.small
	},
	'4:5': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': squarish.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': squarish.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': squarish.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': squarish.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': squarish.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': squarish.medium,
		default: squarish.small
	},
	'2:3': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': portrait.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': portrait.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': portrait.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': portrait.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': portrait.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': portrait.medium,
		default: portrait.small
	},
	'3:2': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': landscape.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': landscape.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': landscape.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': landscape.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': landscape.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': landscape.medium,
		default: landscape.small
	},
	'9:16': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': mobile.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': mobile.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': mobile.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': mobile.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': mobile.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': mobile.medium,
		default: mobile.small
	},
	'16:9': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': desktop.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': desktop.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': desktop.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': desktop.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': desktop.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': desktop.medium,
		default: desktop.small
	},
	'2.4:1': {
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': anamorphic.large,
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': anamorphic.large,
		'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': anamorphic.large,
		'4e54440f-ee17-4712-b4b6-0671b94d685d': anamorphic.large,
		'b6c1372f-31a7-457c-907c-d292a6ffef97': anamorphic.medium,
		'22b0857d-7edc-4d00-9cd9-45aa509db093': anamorphic.medium,
		default: anamorphic.small
	}
};

export function getAspectRatioFromWidthAndHeight(
	width: string | number | null | undefined,
	height: string | number | null | undefined
) {
	if (!width || !height) {
		return null;
	}
	let widthNumber, heightNumber: number;
	if (typeof width === 'string') {
		widthNumber = parseInt(width);
	} else {
		widthNumber = width;
	}
	if (typeof height === 'string') {
		heightNumber = parseInt(height);
	} else {
		heightNumber = height;
	}
	const ratio = aspectRatioRounded(widthNumber / heightNumber);
	const resIndex = availableAspectRatioValues.findIndex((value) => value === ratio);
	if (resIndex === -1) {
		return null;
	}
	return availableAspectRatios[resIndex];
}

function aspectRatioRounded(ratio: number) {
	return Math.round(ratio * aspectRatioRounding) / aspectRatioRounding;
}
