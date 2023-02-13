import type { TGeneration, TInitialGenerationRequest } from '$ts/stores/generation';
import type { IUserPlan } from '$ts/types/stripe';
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

export function mLogSignIn(props: ISignInProps) {
	mixpanel.track('Sign In', {
		...props
	});
}

export function mLogSignOut(props: ISignOutProps) {
	mixpanel.track('Sign Out', {
		...props
	});
}

export function mLogSignUp(props: ISignUpProps) {
	mixpanel.track('Sign Up', {
		...props
	});
}

export function mLogGallerySearch(props: IGallerySearchProps) {
	mixpanel.track('Gallery Search', {
		...props
	});
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
	plan: IUserPlan;
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

interface ISubmitToGalleryToggledMinimal {
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
}
type IOnOff = 'On' | 'Off';

interface IGalleryGenerationOpenedProps {
	'SC - Generation Id': string;
	'SC - Plan': IUserPlan;
	'SC - Advanced Mode': boolean;
}

interface IGalleryGenerateClickedProps {
	'SC - Generation Id': string;
	'SC - Plan': IUserPlan;
	'SC - Advanced Mode': boolean;
}

interface IAdvancedModeToggledProps {
	'SC - Plan': IUserPlan;
}

interface IUpscaleMinimal {
	'SC - Width': number;
	'SC - Height': number;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
	'SC - Plan': IUserPlan;
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
	'SC - Plan': IUserPlan;
}

interface IPageviewProps {
	'SC - Page': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
}

interface ISignInProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
	'SC - Page': string;
	'SC - Email': string;
}

interface ISignOutProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
	'SC - Page': string;
}

interface ISignUpProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
	'SC - Page': string;
}

interface IGallerySearchProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Plan': IUserPlan;
	'SC - Search Query': string;
}
