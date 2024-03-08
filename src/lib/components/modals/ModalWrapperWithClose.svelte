<script lang="ts">
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import ModalWrapper from './ModalWrapper.svelte';

	export let onCloseClicked: () => void;
	export let hasPadding = true;
</script>

<ModalWrapper let:scrollY {hasPadding}>
	<div class="sticky top-0 z-20 flex w-full items-center justify-start px-1 pb-1 pt-1 md:hidden">
		<div
			class="flex items-center justify-center rounded-full transition duration-150 {scrollY &&
			scrollY > 5
				? 'bg-c-bg-secondary/75'
				: 'bg-c-bg-secondary/0'}"
		>
			<IconButton name="Close" onClick={onCloseClicked}>
				<IconCancel class="h-9 w-9 transition not-touch:group-hover/iconbutton:text-c-primary" />
			</IconButton>
		</div>
	</div>
	<slot />
</ModalWrapper>
