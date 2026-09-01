/** Slug used for the pseudo-category that collects photos without a category. */
export const UNCATEGORIZED_SLUG = 'overige';

/** Label for that pseudo-category. */
export const UNCATEGORIZED_NAME = 'Overige';

/** Square cover image URL for a category card, or null when there is no image. */
export function coverUrl(urlFor: (source: any) => any, source: any): string | null {
	if (!source?.asset) return null;
	return urlFor(source).width(800).height(800).fit('crop').auto('format').url();
}
