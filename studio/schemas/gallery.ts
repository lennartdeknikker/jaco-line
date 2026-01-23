import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'gallery',
	title: 'Gallery',
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
	],
	preview: {
		select: {
			title: 'alt',
			media: 'image',
		},
	},
});
