<script lang="ts">
	import { page } from '$app/stores';
	import Input from '$components/Input.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import ErrorLine from '$components/error/ErrorLine.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { apiUrl } from '$ts/constants/main';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { userSummary } from '$ts/stores/user/summary';
	import { createDialog } from '@melt-ui/svelte';
	import { z } from 'zod';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { logUsernameChanged } from '$ts/helpers/loggers';
	import { appVersion } from '$ts/stores/appVersion';

	export let afterUsernameChanged: ((username: string) => Promise<void>) | undefined = undefined;
	export let closeOnSuccess = false;
	const { trigger, portal, overlay, content, title, close, open, options } = createDialog();

	let usernameInputValue = $userSummary?.username || '';

	$: schema = z.object({
		username: z
			.string()
			.min(3, $LL.ChangeUsername.Error.MinimumCharacters({ count: 3 }))
			.max(25, $LL.ChangeUsername.Error.MaximumCharacters({ count: 25 }))
			.refine((value) => {
				return /^[a-zA-Z0-9-]+$/.test(value);
			}, $LL.ChangeUsername.Error.InvalidCharacters())
	});

	$: usernameFormObj = createForm<z.infer<typeof schema>>({
		initialValues: { username: $userSummary?.username },
		onSubmit: async (values) => {
			await onSubmit(values.username);
		},
		onError: () => {
			return { username: [$LL.ChangeUsername.Error.NotAvailable()] };
		},
		extend: [validator({ schema }), validator({ schema, level: 'warning' })]
	});
	$: usernameForm = usernameFormObj.form;
	$: usernameFormErrors = usernameFormObj.errors;
	$: isSubmittingUsernameForm = usernameFormObj.isSubmitting;

	$: $open, onOpenChanged();
	$: $isSubmittingUsernameForm, enableOrDisableEasyClose();

	function enableOrDisableEasyClose() {
		if ($isSubmittingUsernameForm) {
			disableEasyClose();
		} else {
			enableEasyClose();
		}
	}

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

	async function onSubmit(newUsername: string) {
		if (!$page.data.session?.access_token) return;
		if ($userSummary?.username === newUsername) {
			open.set(false);
			return;
		}
		const oldUsername = $userSummary?.username || '';
		const res = await fetch(`${apiUrl.origin}/v1/user/username/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$page.data.session.access_token}`
			},
			body: JSON.stringify({ username: newUsername })
		});
		if (!res.ok) {
			throw new Error('Something went wrong with username change');
		} else {
			const resJson: { username: string } = await res.json();
			const { username: usernameFromServer } = resJson;
			logUsernameChanged({
				'SC - App Version': $appVersion,
				'SC - Locale': $locale,
				'SC - New Username': usernameFromServer,
				'SC - Old Username': oldUsername,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - User Id': $page.data.session.user.id
			});
			const us = await getUserSummary($page.data.session.access_token);
			if (us) {
				userSummary.set(us);
				if (afterUsernameChanged) await afterUsernameChanged(usernameFromServer);
				if (closeOnSuccess) open.set(false);
			}
		}
	}

	function onOpenChanged() {
		if (!$open) usernameInputValue = $userSummary?.username || '';
	}
</script>

<slot {trigger} {close} />

<div use:portal>
	{#if $open}
		<div {...$overlay} use:overlay class="fixed inset-0 z-[9999] w-full h-full bg-c-barrier/80" />
		<div
			class="w-full h-full fixed inset-0 z-[10000] flex justify-center px-3 pt-8 pb-12 overflow-auto"
		>
			<div
				{...$content}
				use:content
				class="w-80 max-w-full my-auto bg-c-bg-secondary p-5 ring-2 ring-c-bg-tertiary relative
      	rounded-2xl shadow-generation-modal shadow-c-shadow/[var(--o-shadow-strongest)]"
			>
				<h2 class="text-xl font-bold -mt-1 pl-1 pr-12" {...$title} use:title>
					{$LL.ChangeUsername.ChangeUsernameTitle()}
				</h2>
				<div class="w-full flex flex-col">
					<form use:usernameForm class="flex flex-col gap-2.5 mt-1">
						<Input
							noAutocomplete
							title={$LL.ChangeUsername.UsernameInput.Title()}
							name="username"
							bind:value={usernameInputValue}
							type="text"
							class="mt-4 w-full"
						/>
						<Button withSpinner loading={$isSubmittingUsernameForm} class="w-full">
							{$LL.Shared.ConfirmButton()}
						</Button>
					</form>
					{#if $usernameFormErrors.username}
						<ErrorLine size="sm" text={$usernameFormErrors.username[0]} />
					{/if}
				</div>
				<button
					class="absolute right-0 top-0 p-3 rounded-xl overflow-hidden z-0 group"
					{...$close}
					use:close
				>
					<ButtonHoverEffect color="primary" hoverFrom="bottom" />
					<IconCancel
						class="text-c-on-bg/25 w-6 h-6 not-touch:group-hover:text-c-primary transition"
					/>
				</button>
			</div>
		</div>
	{/if}
</div>
