import { formattedNow } from '$ts/helpers/time';

export function getDiscordWebhookBodyNewSubscriber({
	plan,
	email,
	supabaseId,
	stripeId,
	count
}: {
	plan: string;
	email: string;
	supabaseId: string;
	stripeId: string;
	count: number | null;
}) {
	return {
		content: null,
		embeds: [
			{
				title: `🎉 New Subscriber${count !== null ? ` #${count}` : ''}`,
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
