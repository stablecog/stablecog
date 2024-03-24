import type { LocalizedString } from 'typesafe-i18n';

export interface TFeature {
	paragraph: LocalizedString;
	icon?: ConstructorOfATypedSvelteComponent;
}

export interface TMainFeature {
	title: string;
	subtitle: string;
}

export interface TCard {
	id: string;
	title: LocalizedString;
	currency: 'usd' | 'eur';
	currencySymbol: string;
	promotionCodeId?: string;
	amount: number;
	mainFeatures?: TMainFeature[];
	features: TFeature[];
	ringClass: string;
	badgeText?: string;
	badgeClasses?: string;
}

export interface TSubscriptionCard extends TCard {
	id: 'plan-free' | 'plan-starter' | 'plan-pro' | 'plan-ultimate';
	priceIdMo?: string;
	productId?: string;
	discountRate?: number;
}

export interface TCreditPackCard extends TCard {
	id: 'credit-pack-medium' | 'credit-pack-large' | 'credit-pack-mega';
	priceId: string;
}
