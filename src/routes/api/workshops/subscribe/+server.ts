import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In production, this would submit to Payload CMS
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// TODO: Replace with actual Payload CMS submission
	// const response = await fetch(`${PAYLOAD_URL}/api/workshop-subscriptions`, {
	//   method: 'POST',
	//   headers: { 'Content-Type': 'application/json' },
	//   body: JSON.stringify(data)
	// });

	// For now, just return success
	return json({ success: true }, { status: 200 });
};

