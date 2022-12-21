import mixpanel from 'mixpanel-browser';

export function uLogGeneration(status: IGenerationStatus) {
	if (window.umami) {
		window.umami(`Generation | ${status}`);
	}
}

export function mLogGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	mixpanel.track(`Generation | ${status}`, {
		...generation
	});
}

export function uLogUpscale(status: IUpscaleStatus) {
	if (window.umami) {
		window.umami(`Upscale | ${status}`);
	}
}

export function mLogUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	mixpanel.track(`Upscale | ${status}`, { ...upscale });
}

export function uLogSubmitToGallery(status: IOnOff) {
	if (window.umami) {
		window.umami(`Submit to Gallery | ${status}`);
	}
}

export function mLogSubmitToGallery(status: IOnOff) {
	mixpanel.track(`Submit to Gallery | ${status}`);
}

export function mLogGalleryGenerationOpened(id: string) {
	mixpanel.track('Gallery | Generation Opened', { 'SC - Generation Id': id });
}

export function mLogGalleryGenerateClicked(id: string) {
	mixpanel.track('Gallery | Generate Clicked', { 'SC - Generation Id': id });
}

export function mLogAdvancedMode(status: IOnOff) {
	mixpanel.track(`Advanced Mode | ${status}`);
}

export function mLogPageview(path: string, locale: string, advanced: boolean) {
	mixpanel.track('Pageview', {
		'SC - Page': path,
		'SC - Locale': locale,
		'SC - Advanced Mode': advanced
	});
}

type IGenerationStatus = 'Started' | 'Succeeded' | 'Failed' | 'Failed-NSFW';

type IUpscaleStatus = 'Started' | 'Succeeded' | 'Failed';

type IOnOff = 'On' | 'Off';

interface IUpscaleMinimal {
	'SC - Width': number;
	'SC - Height': number;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
}

interface IGenerationMinimal {
	'SC - Width': number;
	'SC - Height': number;
	'SC - Inference Steps': number;
	'SC - Guidance Scale': number;
	'SC - Model Id'?: string | undefined;
	'SC - Scheduler Id'?: string | undefined;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Submit to Gallery': boolean;
	'SC - Duration'?: number;
}
