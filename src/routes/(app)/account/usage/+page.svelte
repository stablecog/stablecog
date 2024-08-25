<script lang="ts">
	import { browser } from '$app/environment';
	import AccountPageCard from '$approutes/account/AccountPageCard.svelte';
	import UsageInfiniteList from '$approutes/account/usage/UsageInfiniteList.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { auxBucketStaticUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';
	import { getUserOperations, type TUserOperationsPageExtended } from '$ts/queries/operations';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	$: userOperationsQuery = browser
		? createInfiniteQuery({
				queryKey: ['user_operations'],
				queryFn: ({ pageParam }) => {
					return getUserOperations({
						access_token: $sessionStore?.access_token || '',
						cursor: pageParam !== undefined ? String(pageParam) : undefined
					});
				},
				getNextPageParam: (lastPage: TUserOperationsPageExtended) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				},
				initialPageParam: undefined
			})
		: undefined;
</script>

<MetaTag
	title="Usage | Account"
	description="Manage your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{auxBucketStaticUrl}/previews/account-{previewImageVersion}.png"
/>

<div class="flex w-full justify-center pb-6 pt-4 md:px-3 md:pb-8 md:pt-6">
	<div class="flex w-full max-w-4xl flex-col">
		<p class="mb-5 px-5 leading-relaxed md:mb-7">
			{$LL.Account.Usage.PageParagraph()}
		</p>
		<div class="w-full px-3">
			<AccountPageCard>
				<UsageInfiniteList operationsQuery={userOperationsQuery} />
			</AccountPageCard>
		</div>
	</div>
</div>
