import { defineField, defineType } from 'sanity';

export default defineType({
	// Document type id stays 'gallery' so existing content and the site's queries keep working.
	name: 'gallery',
	title: 'Photos',
	type: 'document',
	fields: [
		defineField({
			name: 'alt',
			title: 'Alt tekst',
			type: 'string',
		}),
		defineField({
			name: 'image',
			title: 'Afbeelding',
			type: 'image',
			options: {
				hotspot: true,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'reference',
			to: [{ type: 'photoCategory' }],
		}),
	],
	preview: {
		select: {
			title: 'alt',
			media: 'image',
		},
	},
});
