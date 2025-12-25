import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In production, this would submit to Payload CMS or send email
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// TODO: Replace with actual email service or Payload CMS submission
	// For now, just return success
	return json({ success: true }, { status: 200 });
};


