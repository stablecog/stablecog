<script>
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { logSubmitToGallery } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import { userSummary } from '$ts/stores/user/summary';
	import SubtleButton from '$components/primitives/buttons/SubtleButton.svelte';
	import { sessionStore } from '$ts/constants/supabase';

	$: logProps = {
		'SC - User Id': $sessionStore?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - Advanced Mode': $advancedModeApp,
		'SC - App Version': $appVersion
	};
</script>

<div
	transition:expandCollapse={{ duration: 300 }}
	class="relative flex w-full flex-col justify-start"
>
	<div class="flex w-full items-center justify-center px-4 py-4">
		<div
			class="flex w-full max-w-[21rem] flex-col items-start justify-start gap-4
      rounded-2xl bg-c-bg-secondary px-5 pb-5 pt-4 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
		>
			<div class="flex flex-col items-start justify-start gap-1.5">
				<p class="text-sm font-bold text-c-on-bg/75">
					{$LL.Home.SubmitToGalleryQuestion.Title()}
				</p>
				<p class="text-xs leading-relaxed text-c-on-bg/50">
					{$LL.Home.SubmitToGalleryQuestion.Paragraph()}
				</p>
			</div>
			<div class="flex w-full gap-4">
				<SubtleButton
					onClick={() => {
						shouldSubmitToGallery.set(true);
						logSubmitToGallery('On', logProps);
					}}
					class="flex-1"
				>
					<p class="py-1 text-c-success">{$LL.Shared.YesButton()}</p>
				</SubtleButton>
				<SubtleButton
					onClick={() => {
						shouldSubmitToGallery.set(false);
						logSubmitToGallery('Off', logProps);
					}}
					class="flex-1"
				>
					<p class="py-1 text-c-danger">{$LL.Shared.NoButton()}</p>
				</SubtleButton>
			</div>
		</div>
	</div>
</div>
