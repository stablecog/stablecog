<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Input from '$components/Input.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import ErrorLine from '$components/error/ErrorLine.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import IconEdit from '$components/icons/IconEdit.svelte';
	import { apiUrl } from '$ts/constants/main';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { userSummary } from '$ts/stores/user/summary';
	import { createDialog } from '@melt-ui/svelte';

	export let afterUsernameChanged: (username: string) => Promise<void>;
	const { trigger, portal, overlay, content, title, close, open, options } = createDialog();

	let usernameInputValue = $userSummary?.username || '';
	let usernameChangeStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let usernameChangeError: string | undefined = undefined;

	$: $open, onOpenChanged();

	function disableEasyClose() {
		options.set({
			...$options,
			closeOnEscape: false,
			closeOnOutsideClick: false
		});
	}

	function enableEasyClose() {
		options.set({
			...$options,
			closeOnEscape: true,
			closeOnOutsideClick: true
		});
	}

	async function onSubmit() {
		const newUsername = usernameInputValue;
		if (!$page.data.session?.access_token) return;
		if ($userSummary?.username === newUsername) return;
		usernameChangeStatus = 'loading';
		disableEasyClose();
		try {
			const res = await fetch(`${apiUrl.origin}/v1/user/username/change`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session.access_token}`
				},
				body: JSON.stringify({ username: newUsername })
			});
			if (!res.ok) {
				usernameChangeStatus = 'error';
				usernameChangeError = "This username isn't available.";
			} else {
				const resJson: { username: string } = await res.json();
				const { username: usernameFromServer } = resJson;
				const us = await getUserSummary($page.data.session.access_token);
				if (us) {
					await afterUsernameChanged(usernameFromServer);
					userSummary.set(us);
				}
			}
		} catch (error) {
			usernameChangeStatus = 'error';
			usernameChangeError = "This username isn't available.";
		} finally {
			enableEasyClose();
		}
	}

	function onOpenChanged() {
		if (!$open) usernameInputValue = $userSummary?.username || '';
	}
</script>

<Button noPadding class="p-1.5 rounded-lg" {trigger} noRounding>
	<IconEdit class="w-5 h-5 text-c-on-primary relative" />
</Button>

<div use:portal>
	{#if $open}
		<div {...$overlay} use:overlay class="fixed inset-0 z-[9999] w-full h-full bg-c-barrier/80" />
		<div
			{...$content}
			use:content
			class="max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] fixed w-80 left-1/2 top-1/2 transform z-[10000] -translate-x-1/2
      -translate-y-1/2 bg-c-bg-secondary p-5 ring-2 ring-c-bg-tertiary
      rounded-2xl shadow-generation-modal shadow-c-shadow/[var(--o-shadow-strong)] overflow-auto"
		>
			<h2 class="text-xl font-bold -mt-1 pl-1 pr-12" {...$title} use:title>Change Username</h2>
			<form on:submit|preventDefault={onSubmit} class="flex flex-col gap-2 mt-1">
				<Input
					noAutocomplete
					title="Username"
					bind:value={usernameInputValue}
					type="text"
					class="mt-4 w-full"
				/>
				<Button withSpinner loading={usernameChangeStatus === 'loading'} class="w-full">
					Confirm
				</Button>
			</form>
			{#if usernameChangeError}
				<ErrorLine text={usernameChangeError} />
			{/if}
			<button
				class="absolute right-0 top-0 p-3 rounded-full overflow-hidden z-0 group"
				{...$close}
				use:close
			>
				<ButtonHoverEffect color="primary" hoverFrom="left" />
				<IconCancel
					class="text-c-on-bg/25 w-6 h-6 not-touch:group-hover:text-c-primary transition"
				/>
			</button>
		</div>
	{/if}
</div>
