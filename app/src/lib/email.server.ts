import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export interface WorkshopSubscriptionNotificationOptions {
	to: string;
	subscription: {
		name: string;
		email: string;
		phone: string;
		participantCount?: number;
		remarks?: string;
	};
	workshopTitle: string;
	sessionDate: string;
	sessionTime?: string;
	sessionLocation: string;
}

/** Strip non-ASCII and invisible chars so Resend accepts the address. Export for use when reading from CMS. */
export function sanitizeEmailAddress(email: string): string {
	return email
		.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // zero-width and non-breaking space
		.replace(/[^\x00-\x7F]/g, '') // any other non-ASCII
		.replace(/\s/g, '') // any remaining whitespace
		.trim();
}

const rawFrom = env.EMAIL_FROM || 'onboarding@resend.dev';
const fromAddress = sanitizeEmailAddress(rawFrom) || 'onboarding@resend.dev';

/**
 * Sends a notification email when someone subscribes to a workshop session.
 * Logs errors and rethrows so the caller can decide whether to fail the request.
 */
export async function sendWorkshopSubscriptionNotification(
	options: WorkshopSubscriptionNotificationOptions
): Promise<{ success: boolean; error?: string }> {
	const { subscription, workshopTitle, sessionDate, sessionTime, sessionLocation } = options;
	const to = sanitizeEmailAddress(options.to);

	if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
		console.warn('Workshop notification email skipped: invalid or empty address after sanitization.');
		return { success: false, error: 'Invalid notification email address' };
	}

	const apiKey = env.RESEND_API_KEY;
	if (!apiKey || !apiKey.trim()) {
		console.warn('RESEND_API_KEY is not set; skipping workshop subscription notification email.');
		return { success: false, error: 'RESEND_API_KEY not configured' };
	}

	const lines: string[] = [
		'Nieuwe workshop-inschrijving',
		'',
		'---',
		'Workshop: ' + workshopTitle,
		'Datum: ' + sessionDate,
		...(sessionTime ? ['Tijd: ' + sessionTime] : []),
		'Locatie: ' + sessionLocation,
		'',
		'---',
		'Inschrijving:',
		'Naam: ' + subscription.name,
		'E-mail: ' + subscription.email,
		'Telefoon: ' + subscription.phone,
		...(subscription.participantCount != null
			? ['Aantal deelnemers: ' + subscription.participantCount]
			: []),
		...(subscription.remarks ? ['Opmerkingen: ' + subscription.remarks] : []),
	];
	const text = lines.join('\n');

	const resend = new Resend(apiKey);

	try {
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: [to],
			subject: `Workshop-inschrijving: ${workshopTitle} – ${subscription.name}`,
			text,
		});
		if (error) {
			console.error('Resend error sending workshop subscription notification:', error);
			return { success: false, error: error.message };
		}
		return { success: true };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('Failed to send workshop subscription notification:', err);
		return { success: false, error: message };
	}
}

export interface ContactFormNotificationOptions {
	to: string;
	name: string;
	email: string;
	message: string;
}

/**
 * Sends a notification email when someone submits the contact form.
 */
export async function sendContactFormNotification(
	options: ContactFormNotificationOptions
): Promise<{ success: boolean; error?: string }> {
	const to = sanitizeEmailAddress(options.to);
	if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
		console.warn('Contact form notification skipped: invalid or empty address after sanitization.');
		return { success: false, error: 'Invalid notification email address' };
	}
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey || !apiKey.trim()) {
		console.warn('RESEND_API_KEY is not set; skipping contact form notification.');
		return { success: false, error: 'RESEND_API_KEY not configured' };
	}
	const text = [
		'Nieuw bericht via het contactformulier',
		'',
		'---',
		'Naam: ' + options.name,
		'E-mail: ' + options.email,
		'',
		'Bericht:',
		options.message,
	].join('\n');
	const resend = new Resend(apiKey);
	try {
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: [to],
			subject: `Contactformulier: bericht van ${options.name}`,
			text,
		});
		if (error) {
			console.error('Resend error sending contact form notification:', error);
			return { success: false, error: error.message };
		}
		return { success: true };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('Failed to send contact form notification:', err);
		return { success: false, error: message };
	}
}

export interface NewsletterNotificationOptions {
	to: string;
	email: string;
	name?: string;
}

/**
 * Sends a notification email when someone subscribes to the newsletter.
 */
export async function sendNewsletterSubscriptionNotification(
	options: NewsletterNotificationOptions
): Promise<{ success: boolean; error?: string }> {
	const to = sanitizeEmailAddress(options.to);
	if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
		console.warn('Newsletter notification skipped: invalid or empty address after sanitization.');
		return { success: false, error: 'Invalid notification email address' };
	}
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey || !apiKey.trim()) {
		console.warn('RESEND_API_KEY is not set; skipping newsletter notification.');
		return { success: false, error: 'RESEND_API_KEY not configured' };
	}
	const lines = [
		'Nieuwe nieuwsbrief-inschrijving',
		'',
		'---',
		'E-mail: ' + options.email,
		...(options.name ? ['Naam: ' + options.name] : []),
	];
	const resend = new Resend(apiKey);
	try {
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: [to],
			subject: `Nieuwsbrief-inschrijving: ${options.email}`,
			text: lines.join('\n'),
		});
		if (error) {
			console.error('Resend error sending newsletter notification:', error);
			return { success: false, error: error.message };
		}
		return { success: true };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('Failed to send newsletter notification:', err);
		return { success: false, error: message };
	}
}
