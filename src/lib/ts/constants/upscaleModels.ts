export const availableUpscaleModelIds = ['e94a23f3-d9a4-45e9-bb08-9c7e6bce7b72'] as const;

export type TAvailableUpscaleModelId = (typeof availableUpscaleModelIds)[number];

export const upscaleModelIdDefault: TAvailableUpscaleModelId =
	'e94a23f3-d9a4-45e9-bb08-9c7e6bce7b72';
