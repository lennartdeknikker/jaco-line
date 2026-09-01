import { defineField, defineType } from 'sanity';

export default defineType({
	// Document type id stays 'event' so existing content and the site's queries keep working.
	name: 'event',
	title: 'Market',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titel',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Beschrijving',
			type: 'text',
		}),
		defineField({
			name: 'date',
			title: 'Datum',
			type: 'date',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Locatie',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Afbeelding',
			type: 'image',
			options: { hotspot: true },
			description: 'Thumbnail voor op de marktenpagina.',
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'date',
			media: 'image',
		},
	},
});
