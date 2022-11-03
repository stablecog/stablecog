<script>
	import { expandCollapse } from '$ts/animation/transitions';
	import { pLogSubmitToGallery, uLogSubmitToGallery } from '$ts/helpers/loggers';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import SubtleButton from './buttons/SubtleButton.svelte';
</script>

<div
	transition:expandCollapse={{ duration: 300 }}
	class="w-full flex flex-col justify-start relative overflow-hidden z-0"
>
	<div class="w-full flex items-center justify-center py-4 px-4">
		<div
			class="bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] px-5 pb-5 pt-4 rounded-2xl 
      flex flex-col items-start justify-start gap-4 w-full max-w-[21rem]"
		>
			<div class="flex flex-col items-start justify-start gap-1.5">
				<p class="text-sm font-bold text-c-on-bg/75">Submit generations to the gallery?</p>
				<p class="text-xs text-c-on-bg/50 leading-relaxed">
					You can change your preference from the settings later.
				</p>
			</div>
			<div class="w-full flex gap-4">
				<SubtleButton
					onClick={() => {
						shouldSubmitToGallery.set(true);
						pLogSubmitToGallery('On');
						uLogSubmitToGallery('On');
					}}
					class="flex-1 text-c-success"
				>
					<p class="py-1">Yes</p>
				</SubtleButton>
				<SubtleButton
					onClick={() => {
						shouldSubmitToGallery.set(false);
						pLogSubmitToGallery('Off');
						uLogSubmitToGallery('Off');
					}}
					class="flex-1 text-c-danger"
				>
					<p class="py-1">No</p>
				</SubtleButton>
			</div>
		</div>
	</div>
</div>
