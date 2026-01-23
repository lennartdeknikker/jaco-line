import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'workshop',
	title: 'Workshop',
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
			name: 'time',
			title: 'Tijd',
			type: 'string',
		}),
		defineField({
			name: 'location',
			title: 'Locatie',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'price',
			title: 'Prijs (€)',
			type: 'number',
		}),
		defineField({
			name: 'maxParticipants',
			title: 'Maximaal aantal deelnemers',
			type: 'number',
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'date',
		},
	},
});
