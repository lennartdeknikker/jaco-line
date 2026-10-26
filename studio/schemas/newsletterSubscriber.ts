import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'newsletterSubscriber',
	title: 'Newsletter Subscriber',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Naam',
			type: 'string',
		}),
		defineField({
			name: 'email',
			title: 'E-mail',
			type: 'email',
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'email',
			subtitle: 'name',
		},
	},
});
