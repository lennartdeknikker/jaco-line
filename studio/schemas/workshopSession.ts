import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'workshopSession',
	title: 'Workshop datum',
	type: 'document',
	fields: [
		defineField({
			name: 'workshop',
			title: 'Workshop',
			type: 'reference',
			to: [{ type: 'workshop' }],
			validation: (Rule) => Rule.required(),
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
			title: 'Prijs (€) – overschrijft standaard prijs van workshop',
			type: 'number',
		}),
		defineField({
			name: 'maxParticipants',
			title: 'Maximaal aantal deelnemers',
			type: 'number',
		}),
		defineField({
			name: 'isFull',
			title: 'Vol (overschrijft automatische berekening)',
			type: 'boolean',
			description: 'Schakel aan om deze datum handmatig als vol te markeren.',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			workshopTitle: 'workshop.title',
			date: 'date',
		},
		prepare({ workshopTitle, date }) {
			return {
				title: workshopTitle ? `${workshopTitle} – ${date}` : date || 'Workshop datum',
				subtitle: date,
			};
		},
	},
});
