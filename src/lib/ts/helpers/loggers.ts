import type { TGeneration, TInitialGenerationRequest } from '$userStores/generation';
import mixpanel from 'mixpanel-browser';
import posthog from 'posthog-js';

import type { TInitialUpscaleRequest, TUpscale } from '$ts/stores/user/upscale';

export function logGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	mixpanel.track(`Generation | ${status}`, {
		...generation
	});
	posthog.capture(`Generation | ${status}`, {
		...generation
	});
}

export function logUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	mixpanel.track(`Upscale | ${status}`, { ...upscale });
	posthog.capture(`Upscale | ${status}`, { ...upscale });
}

export function logSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	mixpanel.track(`Submit to Gallery | ${status}`, { ...props });
	posthog.capture(`Submit to Gallery | ${status}`, { ...props });
}

export function logGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	mixpanel.track('Gallery | Generation Opened', { ...props });
	posthog.capture('Gallery | Generation Opened', { ...props });
}

export function logGalleryGenerateSimilarClicked(props: IGalleryGenerateClickedProps) {
	mixpanel.track('Gallery | Generate Clicked', { ...props });
	posthog.capture('Gallery | Generate Clicked', { ...props });
}
export function logGalleryExploreStyleClicked(props: IGalleryExploreStyleClickedProps) {
	mixpanel.track('Gallery | Explore Style Clicked', { ...props });
	posthog.capture('Gallery | Explore Style Clicked', { ...props });
}

export function logGalleryExploreSimilarClicked(props: IGalleryExploreSimilarClickedProps) {
	mixpanel.track('Gallery | Explore Similar Clicked', { ...props });
	posthog.capture('Gallery | Explore Similar Clicked', { ...props });
}

export function logUserProfileExploreSimilarClicked(props: ISimilarClickedProps) {
	mixpanel.track('User Profile | Explore Similar Clicked', { ...props });
	posthog.capture('User Profile | Explore Similar Clicked', { ...props });
}

export function logGalleryModalSimilarClicked(props: ISimilarClickedProps) {
	mixpanel.track('Gallery | Modal Similar Clicked', { ...props });
	posthog.capture('Gallery | Modal Similar Clicked', { ...props });
}

export function logShareModalOpened(props: IShareModalOpenedProps) {
	mixpanel.track('Share | Modal Opened', { ...props });
	posthog.capture('Share | Modal Opened', { ...props });
}

export function logShareButtonClicked(props: IShareButtonClickedProps) {
	mixpanel.track('Share | Button Clicked', { ...props });
	posthog.capture('Share | Button Clicked', { ...props });
}

export function logUserProfileModalSimilarClicked(props: ISimilarClickedProps) {
	mixpanel.track('User Profile | Modal Similar Clicked', { ...props });
	posthog.capture('User Profile | Modal Similar Clicked', { ...props });
}

export function logOutputPageSimilarClicked(props: ISimilarClickedProps) {
	mixpanel.track('Output Page | Similar Clicked', { ...props });
	posthog.capture('Output Page | Similar Clicked', { ...props });
}

export function logAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	mixpanel.track(`Advanced Mode | ${status}`, { ...props });
	posthog.capture(`Advanced Mode | ${status}`, { ...props });
}

export function logPageview(props: IPageviewProps) {
	mixpanel.track('Pageview', { ...props });
	posthog.capture('$pageview', { ...props });
}

export function logSignIn(props: ISignInProps) {
	mixpanel.track('Sign In', { ...props });
	posthog.capture('Sign In', { ...props });
}

export function logWantsEmail(props: IWantsEmailProps) {
	mixpanel.track(`Wants Email | ${props.wantsEmail ? 'True' : 'False'}`, { ...props });
	posthog.capture(`Wants Email | ${props.wantsEmail ? 'True' : 'False'}`, { ...props });
}

export function logSignOut(props: IGeneralLogProps) {
	mixpanel.track('Sign Out', { ...props });
	posthog.capture('Sign Out', { ...props });
}

export function logGallerySearch(props: IGallerySearchProps) {
	mixpanel.track('Gallery Search', { ...props });
	posthog.capture('Gallery Search', { ...props });
}

export function logHistorySearch(props: IHistorySearchProps) {
	mixpanel.track('History Search', { ...props });
	posthog.capture('History Search', { ...props });
}

export function logGenerationOutputDeleted(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Deleted', { ...props });
	posthog.capture('Generation Output | Deleted', { ...props });
}

export function logVoiceoverOutputDeleted(props: IVoiceoverOutputActionProps) {
	mixpanel.track('Voiceover Output | Deleted', { ...props });
	posthog.capture('Voiceover Output | Deleted', { ...props });
}

export function logGenerationOutputFavorited(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Favorited', { ...props });
	posthog.capture('Generation Output | Favorited', { ...props });
}

export function logGenerationOutputMadePublic(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Made Public', { ...props });
	posthog.capture('Generation Output | Made Public', { ...props });
}

export function logUsernameChanged(props: IUsernameChangedProps) {
	mixpanel.track('Username Changed', { ...props });
	posthog.capture('Username Changed', { ...props });
}

export function logGenerationOutputMadePrivate(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Made Private', { ...props });
	posthog.capture('Generation Output | Made Private', { ...props });
}

export function logGenerationOutputUnfavorited(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Unfavorited', { ...props });
	posthog.capture('Generation Output | Unfavorited', { ...props });
}

export function logGenerationOutputSubmittedToGallery(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Submitted to Gallery', { ...props });
	posthog.capture('Generation Output | Submitted to Gallery', { ...props });
}

export function logGenerationOutputDownloaded(props: IGenerationOutputActionProps) {
	mixpanel.track('Generation Output | Downloaded', { ...props });
	posthog.capture('Generation Output | Downloaded', { ...props });
}

export function logBatchEditActived(props: IGeneralLogProps) {
	mixpanel.track('Batch Edit | Activated', { ...props });
	posthog.capture('Batch Edit | Activated', { ...props });
}

export function logInitImageAdded(props: IGeneralLogProps) {
	mixpanel.track('Init Image | Added', { ...props });
	posthog.capture('Init Image | Added', { ...props });
}

export function logInitImageRemoved(props: IGeneralLogProps) {
	mixpanel.track('Init Image | Removed', { ...props });
	posthog.capture('Init Image | Removed', { ...props });
}

export function logBatchEditDeactivated(props: IGeneralLogProps) {
	mixpanel.track('Batch Edit | Deactivated', { ...props });
	posthog.capture('Batch Edit | Deactivated', { ...props });
}

export function logLowCreditsCardSeen(props: IGeneralLogProps) {
	mixpanel.track('Low Credits Card | Seen', { ...props });
	posthog.capture('Low Credits Card | Seen', { ...props });
}

export function logLowCreditsCardDiscord(props: IGeneralLogProps) {
	mixpanel.track('Low Credits Card | Discord Clicked', { ...props });
	posthog.capture('Low Credits Card | Discord Clicked', { ...props });
}
export function logLowCreditsCardSubscribe(props: IGeneralLogProps) {
	mixpanel.track('Low Credits Card | Subscribe Clicked', { ...props });
	posthog.capture('Low Credits Card | Subscribe Clicked', { ...props });
}
export function logLowCreditsCardBuyCredits(props: IGeneralLogProps) {
	mixpanel.track('Low Credits Card | Buy Credits Clicked', { ...props });
	posthog.capture('Low Credits Card | Buy Credits Clicked', { ...props });
}
export function logLowCreditsCardUpgradeClicked(props: IGeneralLogProps) {
	mixpanel.track('Low Credits Card | Upgrade Clicked', { ...props });
	posthog.capture('Low Credits Card | Upgrade Clicked', { ...props });
}
export function logSkipTheQueueButtonClicked(props: IGeneralLogProps) {
	mixpanel.track('Skip the Queue Button Clicked', { ...props });
	posthog.capture('Skip the Queue Button Clicked', { ...props });
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
	logGeneration(
		error === 'NSFW' || error === 'nsfw'
			? 'Failed-NSFW'
			: error === 'nsfw_prompt'
			? 'Failed-NSFW-Prompt'
			: 'Failed',
		props
	);
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

interface IGalleryExploreStyleClickedProps {
	'SC - Output Id': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IGalleryExploreSimilarClickedProps {
	'SC - Output Id': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IUsernameChangedProps {
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
	'SC - Old Username': string;
	'SC - New Username': string;
	'SC - Locale': string;
}

interface ISimilarClickedProps {
	'SC - Similar to Output Id'?: string;
	'SC - Clicked Output Id': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}

interface IShareModalOpenedProps {
	'SC - Output Id'?: string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
	'SC - Modal Type': string;
}

interface IShareButtonClickedProps {
	'SC - Output Id'?: string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
	'SC - Share Type': string;
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

type IGenerationStatus = 'Started' | 'Succeeded' | 'Failed' | 'Failed-NSFW' | 'Failed-NSFW-Prompt';

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

interface IWantsEmailProps {
	'SC - Locale': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Page': string;
	'SC - Email': string | undefined;
	'SC - App Version': string;
	wantsEmail: boolean;
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

export interface IVoiceoverOutputActionProps {
	'SC - Voiceover Id'?: string;
	'SC - Output Id': string;
	'SC - Locale': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - Page': string;
	'SC - App Version': string;
}

interface IGeneralLogProps {
	'SC - Locale': string;
	'SC - Page': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
}
