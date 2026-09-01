/**
 * Sanity Schema Definitions
 * 
 * These schemas define the content types in Sanity CMS.
 * You'll need to add these to your Sanity Studio project.
 * 
 * To set up Sanity Studio:
 * 1. Run: npx sanity init
 * 2. Create a new project or link to existing
 * 3. Add these schemas to your schemas folder
 */

export const eventSchema = {
	name: 'event',
	title: 'Event',
	type: 'document',
	fields: [
		{
			name: 'title',
			title: 'Titel',
			type: 'string',
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: 'description',
			title: 'Beschrijving',
			type: 'text',
		},
		{
			name: 'date',
			title: 'Datum',
			type: 'date',
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: 'location',
			title: 'Locatie',
			type: 'string',
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: 'image',
			title: 'Afbeelding',
			type: 'image',
			options: { hotspot: true },
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'date',
			media: 'image',
		},
	},
};

export const gallerySchema = {
	name: 'gallery',
	title: 'Gallery',
	type: 'document',
	fields: [
		{
			name: 'alt',
			title: 'Alt tekst',
			type: 'string',
		},
		{
			name: 'image',
			title: 'Afbeelding',
			type: 'image',
			options: {
				hotspot: true,
			},
			validation: (Rule: any) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: 'alt',
			media: 'image',
		},
	},
};

// Workshop type: one document per kind of workshop (e.g. "Draaien basis"). Has slug, description, images.
export const workshopSchema = {
	name: 'workshop',
	title: 'Workshop type',
	type: 'document',
	fields: [
		{ name: 'title', title: 'Titel', type: 'string', validation: (Rule: any) => Rule.required() },
		{ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (Rule: any) => Rule.required() },
		{ name: 'description', title: 'Beschrijving', type: 'text' },
		{ name: 'shortDescription', title: 'Korte beschrijving', type: 'string' },
		{ name: 'mainImage', title: 'Hoofdafbeelding', type: 'image', options: { hotspot: true } },
		{ name: 'images', title: 'Extra afbeeldingen', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt tekst', type: 'string' }] }] },
		{ name: 'defaultPrice', title: 'Standaard prijs (€)', type: 'number' },
	],
	preview: { select: { title: 'title', media: 'mainImage' } },
};

// Workshop session: one date/time instance of a workshop. Subscriptions reference this.
export const workshopSessionSchema = {
	name: 'workshopSession',
	title: 'Workshop datum',
	type: 'document',
	fields: [
		{ name: 'workshop', title: 'Workshop', type: 'reference', to: [{ type: 'workshop' }], validation: (Rule: any) => Rule.required() },
		{ name: 'date', title: 'Datum', type: 'date', validation: (Rule: any) => Rule.required() },
		{ name: 'time', title: 'Tijd', type: 'string' },
		{ name: 'location', title: 'Locatie', type: 'string', validation: (Rule: any) => Rule.required() },
		{ name: 'price', title: 'Prijs (€)', type: 'number' },
		{ name: 'maxParticipants', title: 'Maximaal aantal deelnemers', type: 'number' },
		{ name: 'isFull', title: 'Vol', type: 'boolean', initialValue: false },
	],
	preview: { select: { workshopTitle: 'workshop.title', date: 'date' }, prepare: ({ workshopTitle, date }: any) => ({ title: workshopTitle ? `${workshopTitle} – ${date}` : date, subtitle: date }) },
};

export const workshopSubscriptionSchema = {
	name: 'workshopSubscription',
	title: 'Workshop Subscription',
	type: 'document',
	fields: [
		{ name: 'name', title: 'Naam', type: 'string', validation: (Rule: any) => Rule.required() },
		{ name: 'email', title: 'E-mail', type: 'email', validation: (Rule: any) => Rule.required() },
		{ name: 'phone', title: 'Telefoon', type: 'string', validation: (Rule: any) => Rule.required() },
		{ name: 'participantCount', title: 'Aantal deelnemers', type: 'number' },
		{ name: 'remarks', title: 'Opmerkingen', type: 'text' },
		{ name: 'workshopSession', title: 'Workshop datum', type: 'reference', to: [{ type: 'workshopSession' }], validation: (Rule: any) => Rule.required() },
	],
	preview: { select: { title: 'name', subtitle: 'email' } },
};

export const newsletterSubscriberSchema = {
	name: 'newsletterSubscriber',
	title: 'Newsletter Subscriber',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Naam',
			type: 'string',
		},
		{
			name: 'email',
			title: 'E-mail',
			type: 'email',
			validation: (Rule: any) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: 'email',
			subtitle: 'name',
		},
	},
};
