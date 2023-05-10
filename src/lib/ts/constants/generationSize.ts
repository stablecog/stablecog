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
	'760',
	'768',
	'784',
	'800',
	'840',
	'912',
	'1024',
	'1128',
	'1152'
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
	{ label: '768', value: '768' },
	{ label: '800', value: '800' },
	{ label: '840', value: '840' },
	{ label: '912', value: '912' },
	{ label: '1024', value: '1024' },
	{ label: '1128', value: '1128' },
	{ label: '1152', value: '1152' }
];
export const widthDefault: TAvailableWidth = '608';

export const availableHeights = [
	'320',
	'328',
	'384',
	'428',
	'432',
	'480',
	'472',
	'512',
	'576',
	'608',
	'640',
	'672',
	'760',
	'768',
	'784',
	'800',
	'840',
	'912',
	'1024',
	'1128',
	'1152'
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
	{ label: '768', value: '768' },
	{ label: '800', value: '800' },
	{ label: '840', value: '840' },
	{ label: '912', value: '912' },
	{ label: '1024', value: '1024' },
	{ label: '1128', value: '1128' },
	{ label: '1152', value: '1152' }
];
export const heightDefault: TAvailableHeight = '912';

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

export const aspectRatioToImageSize: {
	[key in TAvailableAspectRatio]: {
		[key: string]: {
			width: TAvailableWidth;
			height: TAvailableHeight;
		};
	};
} = {
	'1:1': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '768',
			height: '768'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '768',
			height: '768'
		},
		default: {
			width: '512',
			height: '512'
		}
	},
	'4:5': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '672',
			height: '840'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '672',
			height: '840'
		},
		default: {
			width: '512',
			height: '640'
		}
	},
	'2:3': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '608',
			height: '912'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '608',
			height: '912'
		},
		default: {
			width: '512',
			height: '768'
		}
	},
	'3:2': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '912',
			height: '608'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '912',
			height: '608'
		},
		default: {
			width: '768',
			height: '512'
		}
	},
	'9:16': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '576',
			height: '1024'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '576',
			height: '1024'
		},
		default: {
			width: '432',
			height: '768'
		}
	},
	'16:9': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '1024',
			height: '576'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '1024',
			height: '576'
		},
		default: {
			width: '768',
			height: '432'
		}
	},
	'2.4:1': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '1152',
			height: '480'
		},
		'22b0857d-7edc-4d00-9cd9-45aa509db093': {
			width: '1152',
			height: '480'
		},
		default: {
			width: '768',
			height: '320'
		}
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
