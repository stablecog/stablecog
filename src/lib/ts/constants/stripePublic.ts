import {
	PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
	PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
	PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK,
	PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK,
	PUBLIC_STRIPE_PRICE_ID_MEGA_PACK
} from '$env/static/public';

export const STRIPE_CURRENCIES = ['usd', 'eur'] as const;

export const STRIPE_PRICE_IDS_SUBSCRIPTIONS_MO = [
	PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
	PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO
] as const;

export const STRIPE_PRODUCT_IDS_SUBSCRIPTIONS = [
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
] as const;

export const STRIPE_PRICE_IDS_CREDIT_PACKS = [
	PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
	PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
	PUBLIC_STRIPE_PRICE_ID_MEGA_PACK
] as const;

export const STRIPE_PRODUCT_IDS_CREDIT_PACKS = [
	PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK
] as const;

export const STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS =
	STRIPE_PRODUCT_IDS_SUBSCRIPTIONS[STRIPE_PRODUCT_IDS_SUBSCRIPTIONS.length - 1];

export const STRIPE_CURRENCY_TO_SYMBOL: { [currency in TStripeSupportedCurrency]: string } = {
	usd: '$',
	eur: '€'
} as const;

export type TStripeSupportedPriceIdSubscriptionsMo =
	(typeof STRIPE_PRICE_IDS_SUBSCRIPTIONS_MO)[number];

export type TStripeSupportedProductIdSubscriptions =
	(typeof STRIPE_PRODUCT_IDS_SUBSCRIPTIONS)[number];
export type TStripeSupportedCurrency = (typeof STRIPE_CURRENCIES)[number];

export type TStripeSupportedPriceIdCreditPacks = (typeof STRIPE_PRICE_IDS_CREDIT_PACKS)[number];
export type TStripeSupportedProductIdCreditPacks = (typeof STRIPE_PRODUCT_IDS_CREDIT_PACKS)[number];

export const STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO: {
	[prodcutId in TStripeSupportedProductIdSubscriptions]: {
		product_id: TStripeSupportedProductIdSubscriptions;
		monthly_images: number;
		parallel_generations: number;
		prices: {
			[priceId in TStripeSupportedPriceIdSubscriptionsMo]: {
				currencies: {
					[currency in TStripeSupportedCurrency]: {
						amount: number;
					};
				};
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
		monthly_images: 1750,
		parallel_generations: 2,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO]: {
				currencies: {
					usd: {
						amount: 10
					},
					eur: {
						amount: 10
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
		monthly_images: 4500,
		parallel_generations: 3,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO]: {
				currencies: {
					usd: {
						amount: 25
					},
					eur: {
						amount: 25
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
		monthly_images: 10000,
		parallel_generations: 4,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO]: {
				currencies: {
					usd: {
						amount: 50
					},
					eur: {
						amount: 50
					}
				}
			}
		}
	}
} as const;

export const STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS: {
	[prodcutId in TStripeSupportedProductIdCreditPacks]: {
		product_id: TStripeSupportedProductIdCreditPacks;
		images: number;
		prices: {
			[priceId in TStripeSupportedPriceIdCreditPacks]: {
				currencies: {
					[currency in TStripeSupportedCurrency]: {
						amount: number;
					};
				};
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
		images: 1500,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK]: {
				currencies: {
					usd: {
						amount: 10
					},
					eur: {
						amount: 10
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK,
		images: 4000,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_LARGE_PACK]: {
				currencies: {
					usd: {
						amount: 25
					},
					eur: {
						amount: 25
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK,
		images: 9000,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_MEGA_PACK]: {
				currencies: {
					usd: {
						amount: 50
					},
					eur: {
						amount: 50
					}
				}
			}
		}
	}
} as const;

export const getProductIdFromPriceId = (priceId: string) => {
	const productId = Object.keys(STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO).find((productId) =>
		Object.keys(STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[productId].prices).includes(priceId)
	);
	if (productId) {
		return productId;
	}
	return Object.keys(STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS).find((productId) =>
		Object.keys(STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[productId].prices).includes(priceId)
	);
};
