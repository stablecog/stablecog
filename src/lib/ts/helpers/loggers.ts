import type { TGeneration, TInitialGenerationRequest } from '$userStores/generation';
import ph from 'posthog-js';

import type { TInitialUpscaleRequest, TUpscale } from '$ts/stores/user/upscale';

export function logGeneration(status: IGenerationStatus, generation: IGenerationMinimal) {
	ph.capture(`Generation | ${status}`, {
		...generation
	});
}

export function logUpscale(status: IUpscaleStatus, upscale: IUpscaleMinimal) {
	ph.capture(`Upscale | ${status}`, { ...upscale });
}

export function logSubmitToGallery(status: IOnOff, props: ISubmitToGalleryToggledMinimal) {
	ph.capture(`Submit to Gallery | ${status}`, { ...props });
}

export function logGalleryGenerationOpened(props: IGalleryGenerationOpenedProps) {
	ph.capture('Gallery | Generation Opened', { ...props });
}

export function logGalleryGenerateSimilarClicked(props: IGalleryGenerateClickedProps) {
	ph.capture('Gallery | Generate Clicked', { ...props });
}
export function logGalleryExploreStyleClicked(props: IGalleryExploreStyleClickedProps) {
	ph.capture('Gallery | Explore Style Clicked', { ...props });
}

export function logGalleryExploreSimilarClicked(props: IGalleryExploreSimilarClickedProps) {
	ph.capture('Gallery | Explore Similar Clicked', { ...props });
}

export function logUserProfileExploreSimilarClicked(props: ISimilarClickedProps) {
	ph.capture('User Profile | Explore Similar Clicked', { ...props });
}

export function logGalleryModalSimilarClicked(props: ISimilarClickedProps) {
	ph.capture('Gallery | Modal Similar Clicked', { ...props });
}

export function logShareModalOpened(props: IShareModalOpenedProps) {
	ph.capture('Share | Modal Opened', { ...props });
}

export function logShareButtonClicked(props: IShareButtonClickedProps) {
	ph.capture('Share | Button Clicked', { ...props });
}

export function logUserProfileModalSimilarClicked(props: ISimilarClickedProps) {
	ph.capture('User Profile | Modal Similar Clicked', { ...props });
}

export function logOutputPageSimilarClicked(props: ISimilarClickedProps) {
	ph.capture('Output Page | Similar Clicked', { ...props });
}

export function logAdvancedMode(status: IOnOff, props: IAdvancedModeToggledProps) {
	ph.capture(`Advanced Mode | ${status}`, { ...props });
}

export function logPageview(props: IPageviewProps) {
	ph.capture('$pageview', { ...props });
}

export function logSignIn(props: ISignInProps) {
	ph.capture('Sign In', { ...props });
}

export function logWantsEmail(props: IWantsEmailProps) {
	ph.capture(`Wants Email | ${props.wantsEmail ? 'True' : 'False'}`, { ...props });
}

export function logSignOut(props: IGeneralLogProps) {
	ph.capture('Sign Out', { ...props });
}

export function logGallerySearch(props: IGallerySearchProps) {
	ph.capture('Gallery Search', { ...props });
}

export function logHistorySearch(props: IHistorySearchProps) {
	ph.capture('History Search', { ...props });
}

export function logGenerationOutputDeleted(props: IGenerationOutputActionProps) {
	ph.capture('Generation Output | Deleted', { ...props });
}

export function logVoiceoverOutputDeleted(props: IVoiceoverOutputActionProps) {
	ph.capture('Voiceover Output | Deleted', { ...props });
}

export function logGenerationOutputMadePublic(props: IGenerationOutputActionProps) {
	ph.capture('Generation Output | Made Public', { ...props });
}

export function logUsernameChanged(type: 'change' | 'set', props: IUsernameChangedProps) {
	if (type === 'set') {
		ph.capture('Username Set', { ...props });
	} else {
		ph.capture('Username Changed', { ...props });
	}
}

export function logGenerationOutputMadePrivate(props: IGenerationOutputActionProps) {
	ph.capture('Generation Output | Made Private', { ...props });
}

export function logGenerationOutputFavoritedChange(
	action: 'favorite' | 'unfavorite',
	props: IGenerationOutputActionProps
) {
	if (action === 'unfavorite') {
		ph.capture('Generation Output | Unfavorited', { ...props });
	} else {
		ph.capture('Generation Output | Favorited', { ...props });
	}
}

export function logGenerationOutputLikedChange(
	isLiked: boolean,
	likeCount: number,
	props: IGenerationOutputActionProps
) {
	const extraProps = {
		'SC - Like Count': likeCount
	};
	if (isLiked) {
		ph.capture('Generation Output | Liked', { ...props, ...extraProps });
	} else {
		ph.capture('Generation Output | Unliked', { ...props, ...extraProps });
	}
}

export function logGenerationOutputSubmittedToGallery(props: IGenerationOutputActionProps) {
	ph.capture('Generation Output | Submitted to Gallery', { ...props });
}

export function logGalleryMainSortChanged(props: IGalleryMainSortChangedProps) {
	ph.capture('Gallery | Main Sort Changed', { ...props });
}

export function logGenerationOutputDownloaded(props: IGenerationOutputActionProps) {
	ph.capture('Generation Output | Downloaded', { ...props });
}

export function logBatchEditActived(props: IGeneralLogProps) {
	ph.capture('Batch Edit | Activated', { ...props });
}

export function logInitImageAdded(props: IGeneralLogProps) {
	ph.capture('Init Image | Added', { ...props });
}

export function logInitImageRemoved(props: IGeneralLogProps) {
	ph.capture('Init Image | Removed', { ...props });
}

export function logBatchEditDeactivated(props: IGeneralLogProps) {
	ph.capture('Batch Edit | Deactivated', { ...props });
}

export function logLowCreditsCardSeen(props: IGeneralLogProps) {
	ph.capture('Low Credits Card | Seen', { ...props });
}

export function logLowCreditsCardDiscord(props: IGeneralLogProps) {
	ph.capture('Low Credits Card | Discord Clicked', { ...props });
}
export function logLowCreditsCardSubscribe(props: IGeneralLogProps) {
	ph.capture('Low Credits Card | Subscribe Clicked', { ...props });
}
export function logLowCreditsCardBuyCredits(props: IGeneralLogProps) {
	ph.capture('Low Credits Card | Buy Credits Clicked', { ...props });
}
export function logLowCreditsCardUpgradeClicked(props: IGeneralLogProps) {
	ph.capture('Low Credits Card | Upgrade Clicked', { ...props });
}
export function logSkipTheQueueButtonClicked(props: IGeneralLogProps) {
	ph.capture('Skip the Queue Button Clicked', { ...props });
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

interface IGalleryMainSortChangedProps {
	'SC - Locale': string;
	'SC - User Id': string | undefined;
	'SC - Stripe Product Id': string | undefined;
	'SC - App Version': string;
	'SC - Main Sort': string;
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
