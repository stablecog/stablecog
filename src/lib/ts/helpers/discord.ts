import { formattedNow } from '$ts/helpers/time';

export function getDiscordWebhookBodyNewSubscriber({
	plan,
	email,
	supabaseId,
	stripeId,
	countryCode
}: {
	plan: string;
	email: string;
	supabaseId: string;
	stripeId: string;
	countryCode: string | null;
}) {
	return {
		content: null,
		embeds: [
			{
				title: '🎉 New Subscriber!',
				color: 11437567,
				fields: [
					{
						name: 'Email',
						value: email
					},
					{
						name: 'Plan',
						value: plan
					},
					{
						name: 'Supabase ID',
						value: supabaseId
					},
					{
						name: 'Stripe ID',
						value: stripeId
					},
					{
						name: 'Country Code',
						value: countryCode ?? 'Unknown'
					}
				],
				footer: {
					text: formattedNow()
				}
			}
		],
		attachments: []
	};
}
