<script lang="ts">
	import { page } from '$app/stores';
	import Input from '$components/primitives/Input.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
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
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { sessionStore } from '$ts/constants/supabase';

	export let afterUsernameChanged: ((username: string) => Promise<void>) | undefined = undefined;
	export let dontCloseOnSuccess = false;
	export let isOpen = writable(false);
	export let type: 'change' | 'set' = 'change';

	const {
		elements: { trigger, close, content, overlay, title, portalled },
		states: { open },
		options
	} = createDialog({ open: isOpen });

	const schema = z.object({
		username: z
			.string()
			.min(3, $LL.ChangeUsername.Error.MinimumCharacters({ count: 3 }))
			.max(25, $LL.ChangeUsername.Error.MaximumCharacters({ count: 25 }))
			.refine((value) => {
				return /^[a-zA-Z0-9-]+$/.test(value);
			}, $LL.ChangeUsername.Error.InvalidCharacters())
	});

	let { form, data, errors, isSubmitting, setInitialValues } = createForm<z.infer<typeof schema>>({
		initialValues: {
			username:
				type === 'set' ? '' : $userSummary?.username !== undefined ? $userSummary.username : ''
		},
		onSubmit: async (values) => {
			await onSubmit(values.username);
		},
		onError: (e) => {
			return { username: [$LL.ChangeUsername.Error.NotAvailable()] };
		},
		extend: [validator({ schema }), validator({ schema, level: 'warning' })]
	});

	$: [$userSummary], resetForm();

	function resetForm() {
		if (!$userSummary?.username) return;
		if (type === 'set') return;
		setInitialValues({ username: $userSummary.username });
	}

	$: $isSubmitting, enableOrDisableEasyClose();

	function enableOrDisableEasyClose() {
		if ($isSubmitting) {
			disableEasyClose();
		} else {
			enableEasyClose();
		}
	}

	function disableEasyClose() {
		options.closeOnEscape.set(false);
		options.closeOnOutsideClick.set(false);
	}

	function enableEasyClose() {
		options.closeOnEscape.set(true);
		options.closeOnOutsideClick.set(true);
	}

	async function onSubmit(newUsername: string) {
		if (!$sessionStore?.access_token) return;
		if ($userSummary?.username === newUsername) {
			open.set(false);
			return;
		}
		const oldUsername = $userSummary?.username || '';
		const res = await fetch(`${apiUrl.origin}/v1/user/username/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$sessionStore.access_token}`
			},
			body: JSON.stringify({ username: newUsername })
		});
		if (!res.ok) {
			throw new Error("Response wasn't okay when changing username");
		}
		const resJson: { username: string; error?: string } = await res.json();
		if (resJson.error)
			throw new Error(resJson.error || 'Something went wrong with username change');
		const { username: usernameFromServer } = resJson;
		logUsernameChanged(type, {
			'SC - App Version': $appVersion,
			'SC - Locale': $locale,
			'SC - New Username': usernameFromServer,
			'SC - Old Username': oldUsername,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - User Id': $sessionStore.user.id
		});
		const us = await getUserSummary($sessionStore.access_token);
		if (us) {
			userSummary.set(us);
			if (afterUsernameChanged) await afterUsernameChanged(usernameFromServer);
			if (!dontCloseOnSuccess) open.set(false);
		}
	}

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<slot {trigger} {close} />

{#if mounted}
	<div use:portalled {...$portalled}>
		{#if $open}
			<div {...$overlay} use:overlay class="fixed inset-0 z-[9999] h-full w-full bg-c-barrier/80" />
			<div
				class="fixed inset-0 z-[10000] flex h-full w-full justify-center overflow-auto px-3 pb-12 pt-8"
			>
				<div
					{...$content}
					use:content
					class="relative my-auto w-full max-w-sm rounded-2xl bg-c-bg-secondary p-5 shadow-generation-modal shadow-c-shadow/[var(--o-shadow-strongest)]
      		ring-2 ring-c-bg-tertiary md:p-7"
				>
					<h2 class="-mt-1 pl-1 pr-12 text-xl font-bold md:-mt-2" {...$title} use:title>
						{type === 'set'
							? $LL.ChangeUsername.PickUsernameTitle()
							: $LL.ChangeUsername.ChangeUsernameTitle()}
					</h2>
					<div class="mt-0.5 flex w-full flex-col md:mt-1">
						<form use:form class="flex flex-col gap-2.5">
							<Input
								noAutocomplete
								noAutocapitalize
								noAutocorrect
								title={$LL.ChangeUsername.UsernameInput.Title()}
								name="username"
								bind:value={$data.username}
								type="text"
								class="mt-4 w-full"
							/>
							<Button withSpinner loading={$isSubmitting} class="w-full">
								{$LL.Shared.ConfirmButton()}
							</Button>
						</form>
						{#if $errors.username}
							<ErrorLine size="sm" text={$errors.username[0]} />
						{/if}
					</div>
					<button
						class="group absolute right-0 top-0 z-0 overflow-hidden rounded-xl p-3"
						{...$close}
						use:close
					>
						<ButtonHoverEffect color="primary" hoverFrom="bottom" />
						<IconCancel
							class="h-6 w-6 text-c-on-bg/25 transition not-touch:group-hover:text-c-primary"
						/>
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
