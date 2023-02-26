export type TGenerationFullScreenModalType = 'generate' | 'history' | 'gallery';
export interface TCopiableButtonsObjects {
	[key: string]: TCopiableButtonsObject;
}

export interface TCopiableButtonsObject {
	copied: boolean;
	timeout?: NodeJS.Timeout | undefined;
}
