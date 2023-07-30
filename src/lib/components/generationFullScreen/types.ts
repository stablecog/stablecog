export type TGenerationFullScreenModalType =
	| 'generate'
	| 'history'
	| 'gallery'
	| 'admin-gallery'
	| 'stage'
	| 'other-user';
export interface TButtonObjectsWithState {
	[key: string]: TButtonObjectWithState;
}

export interface TButtonObjectWithState {
	state: TButtonObjectState;
	timeout?: NodeJS.Timeout | undefined;
}

export type TButtonObjectState = 'idle' | 'loading' | 'success';

export type TSetButtonObjectWithState = (key: string, state: TButtonObjectState) => void;
