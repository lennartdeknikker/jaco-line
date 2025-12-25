export interface Event {
	id: string;
	title: string;
	description?: string;
	date: string;
	location: string;
	createdAt: string;
	updatedAt: string;
}

export interface GalleryImage {
	id: string;
	alt?: string;
	image?: {
		url: string;
		alt?: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface Workshop {
	id: string;
	title: string;
	description?: string;
	date: string;
	time?: string;
	location: string;
	price?: number;
	maxParticipants?: number;
	createdAt: string;
	updatedAt: string;
}

export interface NewsletterSubscriber {
	id: string;
	email: string;
	name?: string;
	createdAt: string;
}

