import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'workshopSubscription',
	title: 'Workshop Subscription',
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
			name: 'phone',
			title: 'Telefoon',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'participantCount',
			title: 'Aantal deelnemers',
			type: 'number',
			validation: (Rule) => Rule.min(0).max(20).integer(),
		}),
		defineField({
			name: 'remarks',
			title: 'Opmerkingen',
			type: 'text',
		}),
		defineField({
			name: 'workshopSession',
			title: 'Workshop datum',
			type: 'reference',
			to: [{ type: 'workshopSession' }],
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'email',
		},
	},
});
