import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';
import { verifyTurnstileToken } from '$lib/turnstile.server';
import { sendNewsletterSubscriptionNotification, sanitizeEmailAddress } from '$lib/email.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.email) {
			return json({ success: false, error: 'E-mail is verplicht' }, { status: 400 });
		}

		// Verify Turnstile token
		if (data.turnstileToken) {
			const isValid = await verifyTurnstileToken(data.turnstileToken);
			if (!isValid) {
				return json(
					{ success: false, error: 'CAPTCHA verificatie mislukt. Probeer het opnieuw.' },
					{ status: 400 }
				);
			}
		}

		// Check if email already exists
		const existing = await sanityClient.fetch(
			`*[_type == "newsletterSubscriber" && email == $email][0]`,
			{ email: data.email }
		);

		if (existing) {
			return json(
				{ success: false, error: 'Dit e-mailadres is al ingeschreven' },
				{ status: 400 }
			);
		}

		const subscriber = {
			_type: 'newsletterSubscriber',
			name: data.name || '',
			email: data.email
		};

		const result = await sanityClient.create(subscriber);

		// Send notification email if enabled in Sanity
		const settings = await sanityClient.fetch<{
			notificationEmail?: string;
			newsletterNotificationEnabled?: boolean;
		}>(`*[_type == "siteSettings"][0]{ notificationEmail, newsletterNotificationEnabled }`);
		const rawNotificationEmail = settings?.notificationEmail?.trim();
		const notificationEmail = rawNotificationEmail ? sanitizeEmailAddress(rawNotificationEmail) : '';
		if (settings?.newsletterNotificationEnabled && notificationEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)) {
			const sendResult = await sendNewsletterSubscriptionNotification({
				to: notificationEmail,
				email: data.email,
				...(data.name ? { name: data.name } : {}),
			});
			if (!sendResult.success) {
				console.error('Newsletter notification email failed:', sendResult.error);
			}
		}

		return json({ success: true, id: result._id }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating newsletter subscription:', error);
		return json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
	}
};


