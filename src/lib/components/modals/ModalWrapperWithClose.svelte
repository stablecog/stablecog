<script lang="ts">
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import ModalWrapper from '../ModalWrapper.svelte';

	export let onCloseClicked: () => void;
	export let hasPadding = true;
</script>

<ModalWrapper let:scrollY {hasPadding}>
	<div class="w-full sticky z-20 top-0 flex items-center justify-start md:hidden pt-1 pb-1 px-1">
		<div
			class="flex items-center justify-center transition duration-150 rounded-full {scrollY &&
			scrollY > 5
				? 'bg-c-bg-secondary/75'
				: 'bg-c-bg-secondary/0'}"
		>
			<IconButton name="Close" onClick={onCloseClicked}>
				<IconCancel class="w-9 h-9 transition not-touch:group-hover/iconbutton:text-c-primary" />
			</IconButton>
		</div>
	</div>
	<slot />
</ModalWrapper>
