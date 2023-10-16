import type { TIconSc } from '$ts/types/main';

interface TApp {
	icon: TIconSc;
	localizedName: string;
}

export const getAppFromAppId = (
	appId: string | undefined | null,
	$LL: TranslationFunctions
): TApp | null => {
	if (!appId) return null;
	const appIdToObject: Record<string, TApp> = {
		'e1d7e2fd-a173-473b-98f2-680d14283e75': {
			icon: 'raycast',
			localizedName: $LL.Platform.Raycast()
		}
	};
	const app = appIdToObject[appId];
	if (!app) return null;
	return app;
};
