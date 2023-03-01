import type { TGeneration, TInitialGenerationRequest } from '$userStores/generation';
import mixpanel from 'mixpanel-browser';
import posthog from 'posthog-js';

import type { TInitialUpscaleRequest, TUpscale } from '$ts/stores/user/upscale';

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
	posthog.capture(`Generation | ${status}`, {
		...generation
	});
}

export function mLogUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	mixpanel.track(`Upscale | ${status}`, { ...upscale });
	posthog.capture(`Upscale | ${status}`, { ...upscale });
}

export function mLogSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	mixpanel.track(`Submit to Gallery | ${status}`, { ...props });
	posthog.capture(`Submit to Gallery | ${status}`, { ...props });
}

export function mLogGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	mixpanel.track('Gallery | Generation Opened', { ...props });
	posthog.capture('Gallery | Generation Opened', { ...props });
}

export function mLogGalleryGenerateClicked(props: IGalleryGenerateClickedProps) {
	mixpanel.track('Gallery | Generate Clicked', { ...props });
	posthog.capture('Gallery | Generate Clicked', { ...props });
}

export function mLogAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	mixpanel.track(`Advanced Mode | ${status}`, { ...props });
	posthog.capture(`Advanced Mode | ${status}`, { ...props });
}

export function mLogPageview(props: IPageviewProps) {
	mixpanel.track('Pageview', { ...props });
	posthog.capture('$pageview', { ...props });
}

export function mLogSignIn(props: ISignInProps) {
	mixpanel.track('Sign In', { ...props });
	posthog.capture('Sign In', { ...props });
}

export function mLogSignOut(props: ISignOutProps) {
	mixpanel.track('Sign Out', { ...props });
	posthog.capture('Sign Out', { ...props });
}

export function mLogSignUp(props: ISignUpProps) {
	mixpanel.track('Sign Up', { ...props });
	posthog.capture('Sign Up', { ...props });
}

export function mLogGallerySearch(props: IGallerySearchProps) {
	mixpanel.track('Gallery Search', { ...props });
	posthog.capture('Gallery Search', { ...props });
}

export function logGenerationFailed({
	generation,
	error,
	advancedModeApp,
	locale,
	plan
}: {
	generation: TGeneration | TInitialGenerationRequest;
	error?: string;
	advancedModeApp: boolean;
	locale: string;
	plan: string;
}) {
	const props = mLogGenerationPropsFromGeneration({
		generation,
		advancedModeApp,
		locale,
		plan
	});
	uLogGeneration(error === 'NSFW' ? 'Failed-NSFW' : 'Failed');
	mLogGeneration(error === 'NSFW' ? 'Failed-NSFW' : 'Failed', props);
}

export function mLogGenerationPropsFromGeneration({
	generation,
	advancedModeApp,
	locale,
	plan
}: {
	generation: TGeneration | TInitialGenerationRequest;
	advancedModeApp: boolean;
	locale: string;
	plan: string;
}) {
	return {
		'SC - Width': generation.width,
		'SC - Height': generation.height,
		'SC - Inference Steps': generation.inference_steps,
		'SC - Guidance Scale': generation.guidance_scale,
		'SC - Model Id': generation.model_id,
		'SC - Scheduler Id': generation.scheduler_id,
		'SC - Advanced Mode': advancedModeApp,
		'SC - Locale': locale,
		'SC - Submit to Gallery': generation.submit_to_gallery,
		'SC - Plan': plan
	};
}

export function logUpscaleFailed({
	upscale,
	advancedModeApp,
	locale,
	plan
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	plan: string;
}) {
	const props = mLogUpscalePropsFromUpscale({
		upscale,
		advancedModeApp,
		locale,
		plan
	});
	uLogUpscale('Failed');
	mLogUpscale('Failed', props);
}

export function mLogUpscalePropsFromUpscale({
	upscale,
	advancedModeApp,
	locale,
	plan
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	plan: string;
}) {
	return {
		'SC - Type': upscale.type,
		'SC - Input': upscale.input,
		'SC - Advanced Mode': advancedModeApp,
		'SC - Locale': locale,
		'SC - Plan': plan
	};
}

interface ISubmitToGalleryToggledMinimal {
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
}
type IOnOff = 'On' | 'Off';

interface IGalleryGenerationOpenedProps {
	'SC - Generation Id': string;
	'SC - Plan'?: string;
	'SC - Advanced Mode': boolean;
}

interface IGalleryGenerateClickedProps {
	'SC - Generation Id': string;
	'SC - Plan'?: string;
	'SC - Advanced Mode': boolean;
}

interface IAdvancedModeToggledProps {
	'SC - Plan'?: string;
}

interface IUpscaleMinimal {
	'SC - Image to Upscale'?: string;
	'SC - Output ID'?: string;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
	'SC - Plan'?: string;
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
	'SC - Plan'?: string;
}

interface IPageviewProps {
	'SC - Page': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
}

interface ISignInProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
	'SC - Page': string;
	'SC - Email': string;
}

interface ISignOutProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
	'SC - Page': string;
}

interface ISignUpProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
	'SC - Page': string;
}

interface IGallerySearchProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan'?: string;
	'SC - Search Query': string;
}

interface TLogProps {
	event: string;
	props: { [key: string]: string };
}

export function logEvent(logProps: TLogProps) {
	mixpanel.track(logProps.event, logProps.props);
	posthog.capture(logProps.event, logProps.props);
}
