<script lang="ts">
	import { page } from '$app/stores';
	import DropdownItem from '$components/DropdownItem.svelte';
	import IconSignOut from '$components/icons/IconSignOut.svelte';
	import IconUser from '$components/icons/IconUser.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { supabase } from '$ts/constants/supabase';
	import { mLogSignOut } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import DropdownWrapper from './DropdownWrapper.svelte';

	export let closeAccountMenu: () => void;
</script>

<DropdownWrapper class="w-72 max-w-[calc(100vw-1.75rem)]">
	<div class="w-full px-6 py-4">
		<p class="flex-1 min-w-0 overflow-hidden overflow-ellipsis font-bold text-xl">Account</p>
		<p
			class="flex-1 min-w-0 overflow-hidden overflow-ellipsis font-semibold mt-1 text-xs text-c-on-bg/50"
		>
			{$page.data.session?.user.email}
		</p>
	</div>
	<div class="w-full relative z-20">
		<div class="w-full h-2px rounded-full bg-c-bg-tertiary" />
	</div>
	<div class="w-full flex flex-col justify-start">
		<DropdownItem href="/account" onClick={closeAccountMenu}>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconUser
					class="transition w-6 h-6 text-c-text {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.Account.ManageAccountButton()}
				</p>
			</div>
		</DropdownItem>
		<DropdownItem
			onClick={async () => {
				closeAccountMenu();
				try {
					await supabase.auth.signOut();
					mLogSignOut({
						'SC - Plan': $page.data.tier,
						'SC - Locale': $locale,
						'SC - Advanced Mode': $advancedModeApp,
						'SC - Page': `${$page.url.pathname}${$page.url.search}`
					});
				} catch (error) {
					console.log(error);
				}
			}}
		>
			<div class="flex-1 min-w-0 flex items-center justify-start gap-2.5">
				<IconSignOut
					class="transition w-6 h-6 text-c-text {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
				<p
					class="flex-1 min-w-0 overflow-hidden overflow-ellipsis text-left transition text-c-on-bg {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.SignIn.SignOutButton()}
				</p>
			</div>
		</DropdownItem>
	</div>
</DropdownWrapper>
