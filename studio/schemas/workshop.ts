import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'workshop',
	title: 'Workshop type',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Titel',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug (voor URL, bv. draaien-basis)',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Beschrijving',
			type: 'text',
			description: 'Uitgebreide beschrijving voor de workshop-detailpagina.',
		}),
		defineField({
			name: 'shortDescription',
			title: 'Korte beschrijving',
			type: 'text',
			description: 'Korte tekst voor op de overzichtspagina (optioneel).',
		}),
		defineField({
			name: 'mainImage',
			title: 'Hoofdafbeelding',
			type: 'image',
			options: { hotspot: true },
			description: 'Afbeelding voor de workshop-kaart en detailpagina.',
		}),
		defineField({
			name: 'images',
			title: "Extra afbeeldingen (galerij op detailpagina)",
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						{
							name: 'alt',
							title: 'Alt tekst',
							type: 'string',
						},
					],
				},
			],
		}),
		defineField({
			name: 'defaultPrice',
			title: 'Standaard prijs (€)',
			type: 'number',
			description: 'Kan per datum overschreven worden.',
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'mainImage',
		},
	},
});
