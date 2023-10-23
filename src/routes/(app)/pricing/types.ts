import type { LocalizedString } from 'typesafe-i18n';

export interface TFeature {
	paragraph: LocalizedString;
	icon?: ConstructorOfATypedSvelteComponent;
}

export interface TCard {
	id: string;
	title: LocalizedString;
	currency: 'usd' | 'eur';
	currencySymbol: string;
	promotionCodeId?: string;
	amount: number;
	features: TFeature[];
	ringClass: string;
	badgeText?: string;
	badgeClasses?: string;
}

export interface TSubscriptionCard extends TCard {
	id: 'plan-free' | 'plan-starter' | 'plan-pro' | 'plan-ultimate';
	priceIdMo?: string;
	productId?: string;
}

export interface TCreditPackCard extends TCard {
	id: 'credit-pack-medium' | 'credit-pack-large' | 'credit-pack-mega';
	priceId: string;
}
