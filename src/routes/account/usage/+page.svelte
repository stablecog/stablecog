<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import AccountPageCard from '$routes/account/AccountPageCard.svelte';
	import UsageInfiniteList from '$routes/account/usage/UsageInfiniteList.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { getUserOperations, type TUserOperationsPageExtended } from '$ts/queries/operations';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	$: userOperationsQuery = browser
		? createInfiniteQuery({
				queryKey: ['user_operations'],
				queryFn: (lastPage) => {
					return getUserOperations({
						access_token: $page.data.session?.access_token || '',
						cursor: lastPage?.pageParam
					});
				},
				getNextPageParam: (lastPage: TUserOperationsPageExtended) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				},
				onSuccess: () => {}
		  })
		: undefined;
</script>

<MetaTag
	title="Usage | Account"
	description="Manage your Stablecog account. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	imageUrl="{canonicalUrl}/previews/account-{previewImageVersion}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex justify-center pt-4 md:pt-6 pb-8">
	<div class="w-full max-w-4xl flex flex-col">
		<p class="leading-relaxed mb-5 md:mb-7 px-5">
			{$LL.Account.Usage.PageParagraph()}
		</p>
		<div class="w-full px-3">
			<AccountPageCard>
				<UsageInfiniteList operationsQuery={userOperationsQuery} />
			</AccountPageCard>
		</div>
	</div>
</div>
