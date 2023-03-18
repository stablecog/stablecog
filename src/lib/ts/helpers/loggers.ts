import type { TGeneration, TInitialGenerationRequest } from '$userStores/generation';
import mixpanel from 'mixpanel-browser';
/* import posthog from 'posthog-js'; */

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

export function logGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	mixpanel.track(`Generation | ${status}`, {
		...generation
	});
	/* posthog.capture(`Generation | ${status}`, {
		...generation
	}); */
}

export function logUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	mixpanel.track(`Upscale | ${status}`, { ...upscale });
	/* posthog.capture(`Upscale | ${status}`, { ...upscale }); */
}

export function logSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	mixpanel.track(`Submit to Gallery | ${status}`, { ...props });
	/* posthog.capture(`Submit to Gallery | ${status}`, { ...props }); */
}

export function logGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	mixpanel.track('Gallery | Generation Opened', { ...props });
	/* posthog.capture('Gallery | Generation Opened', { ...props }); */
}

export function logGalleryGenerateSimilarClicked(props: IGalleryGenerateClickedProps) {
	mixpanel.track('Gallery | Generate Clicked', { ...props });
	/* posthog.capture('Gallery | Generate Clicked', { ...props }); */
}

export function logAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	mixpanel.track(`Advanced Mode | ${status}`, { ...props });
	/* posthog.capture(`Advanced Mode | ${status}`, { ...props }); */
}

export function logPageview(props: IPageviewProps) {
	mixpanel.track('Pageview', { ...props });
	/* posthog.capture('$pageview', { ...props }); */
}

export function logSignIn(props: ISignInProps) {
	mixpanel.track('Sign In', { ...props });
	/* posthog.capture('Sign In', { ...props }); */
}

export function logSignOut(props: ISignOutProps) {
	mixpanel.track('Sign Out', { ...props });
	/* posthog.capture('Sign Out', { ...props }); */
}

export function logGallerySearch(props: IGallerySearchProps) {
	mixpanel.track('Gallery Search', { ...props });
	/* posthog.capture('Gallery Search', { ...props }); */
}

export function logGenerationOutputDeleted(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Deleted', { ...props });
}

export function logGenerationOutputFavorited(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Favorited', { ...props });
}

export function logGenerationOutputUnfavorited(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Unfavorited', { ...props });
}

export function logGenerationOutputSubmittedToGallery(
	props: IGenerationOutputSubmittedToGalleryProps
) {
	mixpanel.track('Generation Output | Submitted to Gallery', { ...props });
}

export function logBatchEditActived(props: IBatchEditActivedProps) {
	mixpanel.track('Batch Edit | Activated', { ...props });
	/* posthog.capture('Batch Edit | Activated', { ...props }); */
}

export function logBatchEditDeactivated(props: IBatchEditActivedProps) {
	mixpanel.track('Batch Edit | Deactivated', { ...props });
	/* posthog.capture('Batch Edit | Deactivated', { ...props }); */
}

export function logGenerationFailed({
	generation,
	error,
	advancedModeApp,
	locale,
	stripeProductId
}: {
	generation: TGeneration | TInitialGenerationRequest;
	error?: string;
	advancedModeApp: boolean;
	locale: string;
	stripeProductId?: string;
}) {
	const props = logGenerationPropsFromGeneration({
		generation,
		advancedModeApp,
		locale,
		stripeProductId
	});
	uLogGeneration(error === 'NSFW' ? 'Failed-NSFW' : 'Failed');
	logGeneration(error === 'NSFW' ? 'Failed-NSFW' : 'Failed', props);
}

export function logGenerationPropsFromGeneration({
	generation,
	advancedModeApp,
	locale,
	stripeProductId
}: {
	generation: TGeneration | TInitialGenerationRequest;
	advancedModeApp: boolean;
	locale: string;
	stripeProductId?: string;
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
		'SC - Stripe Product Id': stripeProductId,
		'SC - Number of Outputs': generation.num_outputs
	};
}

export function logUpscaleFailed({
	upscale,
	advancedModeApp,
	locale,
	stripeProductId
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	stripeProductId?: string;
}) {
	const props = logUpscalePropsFromUpscale({
		upscale,
		advancedModeApp,
		locale,
		stripeProductId
	});
	uLogUpscale('Failed');
	logUpscale('Failed', props);
}

export function logUpscalePropsFromUpscale({
	upscale,
	advancedModeApp,
	locale,
	stripeProductId
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	stripeProductId?: string;
}) {
	return {
		'SC - Type': upscale.type,
		'SC - Input': upscale.input,
		'SC - Advanced Mode': advancedModeApp,
		'SC - Locale': locale,
		'SC - Stripe Product Id': stripeProductId
	};
}

interface ISubmitToGalleryToggledMinimal {
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
}
type IOnOff = 'On' | 'Off';

interface IGalleryGenerationOpenedProps {
	'SC - Output Id': string;
	'SC - Stripe Product Id'?: string;
	'SC - Advanced Mode': boolean;
}

interface IGalleryGenerateClickedProps {
	'SC - Output Id': string;
	'SC - Stripe Product Id'?: string;
	'SC - Advanced Mode': boolean;
}

interface IAdvancedModeToggledProps {
	'SC - Stripe Product Id'?: string;
}

interface IUpscaleMinimal {
	'SC - Image to Upscale'?: string;
	'SC - Output ID'?: string;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
	'SC - Stripe Product Id'?: string;
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
	'SC - Stripe Product Id'?: string;
	'SC - Number of Outputs': number;
}

interface IPageviewProps {
	'SC - Page': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
}

interface ISignInProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
	'SC - Page': string;
	'SC - Email': string;
}

interface ISignOutProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
	'SC - Page': string;
}

interface IGallerySearchProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
	'SC - Search Query': string;
}

interface IGenerationOutputActionProps {
	'SC - Generation Id'?: string;
	'SC - Output Id': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
	'SC - Page': string;
}

interface IGenerationOutputSubmittedToGalleryProps {
	'SC - Generation Id'?: string;
	'SC - Output Id': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Stripe Product Id'?: string;
	'SC - Page': string;
}

interface IBatchEditActivedProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Page': string;
	'SC - Stripe Product Id'?: string;
}
