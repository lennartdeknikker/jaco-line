import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'event',
	title: 'Event',
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
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'date',
		},
	},
});
