import type { TTab } from '$ts/types/main';

export const availableWidths = ['384', '432', '512', '608', '640', '760', '768'] as const;
export type TAvailableWidth = (typeof availableWidths)[number];
export const widthTabs: TTab<TAvailableWidth>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const widthDefault: TAvailableWidth = '512';

export const availableHeights = ['384', '432', '512', '608', '640', '760', '768'] as const;
export type TAvailableHeight = (typeof availableWidths)[number];
export const heightTabs: TTab<TAvailableHeight>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const heightDefault: TAvailableHeight = '768';

export const availableAspectRatios = ['1:1', '4:5', '2:3', '3:2', '9:16', '16:9'] as const;
export const availableAspectRatioValues = availableAspectRatios.map((ratio) => {
	const [width, height] = ratio.split(':');
	return parseInt(width) / parseInt(height);
});

export type TAvailableAspectRatio = (typeof availableAspectRatios)[number];
export const aspectRatioTabs: TTab<TAvailableAspectRatio>[] = [
	{ label: '1:1', value: '1:1' },
	{ label: '4:5', value: '4:5' },
	{ label: '2:3', value: '2:3' },
	{ label: '3:2', value: '3:2' },
	{ label: '9:16', value: '9:16' },
	{ label: '16:9', value: '16:9' }
];
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
		default: {
			width: '512',
			height: '512'
		}
	},
	'4:5': {
		'b6c1372f-31a7-457c-907c-d292a6ffef97': {
			width: '608',
			height: '760'
		},
		default: {
			width: '512',
			height: '640'
		}
	},
	'2:3': {
		default: {
			width: '512',
			height: '768'
		}
	},
	'3:2': {
		default: {
			width: '768',
			height: '512'
		}
	},
	'9:16': {
		default: {
			width: '432',
			height: '768'
		}
	},
	'16:9': {
		default: {
			width: '768',
			height: '432'
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
	const ratio = widthNumber / heightNumber;
	const pow = Math.pow(10, 4);
	const resIndex = availableAspectRatioValues.findIndex(
		(value) => Math.round(value * pow) / pow === Math.round(ratio * pow) / pow
	);
	if (resIndex === -1) {
		return null;
	}
	return availableAspectRatios[resIndex];
}
