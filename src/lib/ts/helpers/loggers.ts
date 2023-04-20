import type { TGeneration, TInitialGenerationRequest } from '$userStores/generation';
import posthog from 'posthog-js';

import type { TInitialUpscaleRequest, TUpscale } from '$ts/stores/user/upscale';

export function logGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	posthog.capture(`Generation | ${status}`, {
		...generation
	});
}

export function logUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	posthog.capture(`Upscale | ${status}`, { ...upscale });
}

export function logSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	posthog.capture(`Submit to Gallery | ${status}`, { ...props });
}

export function logGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	posthog.capture('Gallery | Generation Opened', { ...props });
}

export function logGalleryGenerateSimilarClicked(props: IGalleryGenerateClickedProps) {
	posthog.capture('Gallery | Generate Clicked', { ...props });
}

export function logAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	posthog.capture(`Advanced Mode | ${status}`, { ...props });
}

export function logPageview(props: IPageviewProps) {
	posthog.capture('$pageview', { ...props });
}

export function logSignIn(props: ISignInProps) {
	posthog.capture('Sign In', { ...props });
}

export function logSignOut(props: ISignOutProps) {
	posthog.capture('Sign Out', { ...props });
}

export function logGallerySearch(props: IGallerySearchProps) {
	posthog.capture('Gallery Search', { ...props });
}

export function logHistorySearch(props: IHistorySearchProps) {
	posthog.capture('History Search', { ...props });
}

export function logGenerationOutputDeleted(props: IGenerationOutputActionProps) {
	posthog.capture('Generation Output | Deleted', { ...props });
}

export function logGenerationOutputFavorited(props: IGenerationOutputActionProps) {
	posthog.capture('Generation Output | Favorited', { ...props });
}

export function logGenerationOutputUnfavorited(props: IGenerationOutputActionProps) {
	posthog.capture('Generation Output | Unfavorited', { ...props });
}

export function logGenerationOutputSubmittedToGallery(props: IGenerationOutputActionProps) {
	posthog.capture('Generation Output | Submitted to Gallery', { ...props });
}

export function logGenerationOutputDownloaded(props: IGenerationOutputActionProps) {
	posthog.capture('Generation Output | Downloaded', { ...props });
}

export function logBatchEditActived(props: IBatchEditActivedProps) {
	posthog.capture('Batch Edit | Activated', { ...props });
}

export function logInitImageAdded(props: IInitImageActionProps) {
	posthog.capture('Init Image | Added', { ...props });
}

export function logInitImageRemoved(props: IInitImageActionProps) {
	posthog.capture('Init Image | Removed', { ...props });
}

export function logBatchEditDeactivated(props: IBatchEditActivedProps) {
	posthog.capture('Batch Edit | Deactivated', { ...props });
}

export function logGenerationFailed({
	generation,
	error,
	advancedModeApp,
	locale,
	appVersion,
	userId,
	stripeProductId
}: {
	generation: TGeneration | TInitialGenerationRequest;
	error?: string;
	advancedModeApp: boolean;
	locale: string;
	appVersion: string;
	userId?: string;
	stripeProductId?: string;
}) {
	const props = logGenerationPropsFromGeneration({
		generation,
		advancedModeApp,
		locale,
		appVersion,
		userId,
		stripeProductId
	});
	logGeneration(error === 'NSFW' ? 'Failed-NSFW' : 'Failed', props);
}

export function logGenerationPropsFromGeneration({
	generation,
	advancedModeApp,
	locale,
	appVersion,
	userId,
	stripeProductId
}: {
	generation: TGeneration | TInitialGenerationRequest;
	advancedModeApp: boolean;
	locale: string;
	appVersion: string;
	userId?: string;
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
		'SC - User Id': userId,
		'SC - Stripe Product Id': stripeProductId,
		'SC - Number of Outputs': generation.num_outputs,
		'SC - App Version': appVersion
	};
}

export function logUpscaleFailed({
	upscale,
	advancedModeApp,
	locale,
	appVersion,
	userId,
	stripeProductId
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	appVersion: string;
	userId?: string;
	stripeProductId?: string;
}) {
	const props = logUpscalePropsFromUpscale({
		upscale,
		advancedModeApp,
		appVersion,
		locale,
		userId,
		stripeProductId
	});
	logUpscale('Failed', props);
}

export function logUpscalePropsFromUpscale({
	upscale,
	advancedModeApp,
	locale,
	appVersion,
	userId,
	stripeProductId
}: {
	upscale: TUpscale | TInitialUpscaleRequest;
	advancedModeApp: boolean;
	locale: string;
	appVersion: string;
	userId?: string;
	stripeProductId?: string;
}) {
	return {
		'SC - Type': upscale.type,
		'SC - Input': upscale.input,
		'SC - Advanced Mode': advancedModeApp,
		'SC - Locale': locale,
		'SC - User Id': userId,
		'SC - Stripe Product Id': stripeProductId,
		'SC - App Version': appVersion
	};
}

interface ISubmitToGalleryToggledMinimal {
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}
type IOnOff = 'On' | 'Off';

interface IGalleryGenerationOpenedProps {
	'SC - Output Id': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Advanced Mode': boolean;
	'SC - App Version': string;
}

interface IGalleryGenerateClickedProps {
	'SC - Output Id': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Advanced Mode': boolean;
	'SC - App Version': string;
}

interface IAdvancedModeToggledProps {
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IUpscaleMinimal {
	'SC - Image to Upscale'?: string;
	'SC - Output ID'?: string;
	'SC - Advanced Mode': boolean;
	'SC - Locale': string;
	'SC - Duration'?: number;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
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
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Number of Outputs': number;
}

interface IPageviewProps {
	'SC - Page': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface ISignInProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Page': string;
	'SC - Email': string;
	'SC - App Version': string;
}

interface ISignOutProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Page': string;
	'SC - App Version': string;
}

interface IGallerySearchProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IHistorySearchProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

export interface IGenerationOutputActionProps {
	'SC - Generation Id'?: string;
	'SC - Output Id': string;
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Page': string;
	'SC - App Version': string;
}

interface IInitImageActionProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Page': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IBatchEditActivedProps {
	'SC - Locale': string;
	'SC - Advanced Mode': boolean;
	'SC - Page': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}
