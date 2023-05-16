export type TAccountRouteOption = 'account' | 'api-keys' | 'usage';

export interface TAccountRoute {
	name: string;
	href: string;
	icon: TAccountRouteOption;
	strictMatch?: boolean;
}
