import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'siteSettings',
	title: 'Site Instellingen',
	type: 'document',
	__experimental_actions: ['update', 'publish'], // Only allow update and publish, not create/delete
	fields: [
		defineField({
			name: 'title',
			title: 'Titel',
			type: 'string',
			initialValue: 'Site Instellingen',
			readOnly: true,
		}),
		defineField({
			name: 'contactInfo',
			title: 'Contactgegevens',
			type: 'object',
			fields: [
				defineField({
					name: 'email',
					title: 'E-mail',
					type: 'string',
					validation: (Rule) => Rule.required().email(),
				}),
				defineField({
					name: 'phone',
					title: 'Telefoonnummer',
					type: 'string',
					description: 'Optioneel',
				}),
			],
		}),
		defineField({
			name: 'socialLinks',
			title: 'Social Media Links',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'platform',
							title: 'Platform',
							type: 'string',
							options: {
								list: [
									{ title: 'Instagram', value: 'instagram' },
									{ title: 'Facebook', value: 'facebook' },
									{ title: 'X', value: 'x' },
									{ title: 'LinkedIn', value: 'linkedin' },
									{ title: 'Pinterest', value: 'pinterest' },
									{ title: 'TikTok', value: 'tiktok' },
								],
							},
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'url',
							title: 'URL',
							type: 'url',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'label',
							title: 'Label (optioneel)',
							type: 'string',
							description: 'Bijvoorbeeld: @jacoline_keramiek',
						}),
					],
					preview: {
						select: {
							platform: 'platform',
							url: 'url',
							label: 'label',
						},
						prepare({ platform, url, label }) {
							return {
								title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Link',
								subtitle: label || url,
							};
						},
					},
				},
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
	},
});
