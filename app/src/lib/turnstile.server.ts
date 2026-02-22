import { TURNSTILE_SECRET_KEY } from '$env/static/private';

export async function verifyTurnstileToken(token: string): Promise<boolean> {
	if (!TURNSTILE_SECRET_KEY) {
		console.warn('Turnstile secret key not configured, skipping verification');
		return true; // Allow in development if not configured
	}

	if (!token) {
		return false;
	}

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				secret: TURNSTILE_SECRET_KEY,
				response: token
			})
		});

		const data = await response.json();
		return data.success === true;
	} catch (error) {
		console.error('Error verifying Turnstile token:', error);
		return false;
	}
}
