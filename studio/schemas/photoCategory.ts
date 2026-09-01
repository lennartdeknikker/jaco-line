import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'photoCategory',
	title: 'Photo Category',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Category Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
		}),
		defineField({
			name: 'coverImage',
			title: 'Omslagfoto',
			description:
				'Foto die op de fotopagina bij deze categorie wordt getoond. Leeg laten? Dan wordt de nieuwste foto uit de categorie gebruikt.',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'description',
			media: 'coverImage',
		},
	},
});
