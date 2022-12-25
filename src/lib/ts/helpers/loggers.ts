import type { IStripeSubscriptionTier } from '$ts/types/stripe';
import mixpanel from 'mixpanel-browser';

export function uLogGeneration(status: IGenerationStatus) {
	if (window.umami) {
		window.umami(`Generation | ${status}`);
	}
}

export function uLogUpscale(status: IUpscaleStatus) {
	if (window.umami) {
		window.umami(`Upscale | ${status}`);
	}
}

export function uLogSubmitToGallery(status: IOnOff) {
	if (window.umami) {
		window.umami(`Submit to Gallery | ${status}`);
	}
}

export function mLogGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	mixpanel.track(`Generation | ${status}`, {
		...generation
	});
}

export function mLogUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	mixpanel.track(`Upscale | ${status}`, { ...upscale });
}

export function mLogSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	mixpanel.track(`Submit to Gallery | ${status}`, { ...props });
}

export function mLogGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	mixpanel.track('Gallery | Generation Opened', { ...props });
}

export function mLogGalleryGenerateClicked(props: IGalleryGenerateClickedProps) {
	mixpanel.track('Gallery | Generate Clicked', { ...props });
}

export function mLogAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	mixpanel.track(`Advanced Mode | ${status}`, { ...props });
}

export function mLogPageview(props: IPageviewProps) {
	mixpanel.track('Pageview', {
		...props
	});
}

interface ISubmitToGalleryToggledMinimal {
	'SC - Advanced Mode': boolean;
	'SC - Plan': IStripeSubscriptionTier;
}
type IOnOff = 'On' | 'Off';

interface IGalleryGenerationOpenedProps {
	'SC - Generation Id': string;
	'SC - Plan': IStripeSubscriptionTier;
	'SC - Advanced Mode': boolean;
}

interface IGalleryGenerateClickedProps {
	'SC - Generation Id': string;
	'SC - Plan': IStripeSubscriptionTier;
	'SC - Advanced Mode': boolean;
}

interface IAdvancedModeToggledProps {
	'SC - Plan': IStripeSubscriptionTier;
}

interface IUpscaleMinimal {
	'SC - Width': number;
	'SC - Height': number;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
	'SC - Plan': IStripeSubscriptionTier;
}

type IGenerationStatus = 'Started' | 'Succeeded' | 'Failed' | 'Failed-NSFW';

type IUpscaleStatus = 'Started' | 'Succeeded' | 'Failed';

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
	'SC - Plan': IStripeSubscriptionTier;
}

interface IPageviewProps {
	'SC - Page': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IStripeSubscriptionTier;
}
