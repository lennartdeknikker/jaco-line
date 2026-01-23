import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'contactMessage',
	title: 'Contact Message',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Naam',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'email',
			title: 'E-mail',
			type: 'email',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'message',
			title: 'Bericht',
			type: 'text',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'read',
			title: 'Gelezen',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'email',
		},
	},
	orderings: [
		{
			title: 'Nieuwste eerst',
			name: 'newestFirst',
			by: [{ field: '_createdAt', direction: 'desc' }],
		},
		{
			title: 'Oudste eerst',
			name: 'oldestFirst',
			by: [{ field: '_createdAt', direction: 'asc' }],
		},
		{
			title: 'Ongelezen eerst',
			name: 'unreadFirst',
			by: [{ field: 'read', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }],
		},
	],
});
