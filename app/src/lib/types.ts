export interface Event {
	_id: string;
	_type: 'event';
	title: string;
	description?: string;
	date: string;
	location: string;
	_createdAt: string;
	_updatedAt: string;
}

export interface GalleryImage {
	_id: string;
	_type: 'gallery';
	alt?: string;
	image?: any; // Sanity image object
	imageUrl?: string; // Formatted URL from urlFor helper
	_createdAt: string;
	_updatedAt: string;
}

export interface Workshop {
	_id: string;
	_type: 'workshop';
	title: string;
	description?: string;
	date: string;
	time?: string;
	location: string;
	price?: number;
	maxParticipants?: number;
	currentParticipants?: number;
	isFull?: boolean;
	_createdAt: string;
	_updatedAt: string;
}

export interface NewsletterSubscriber {
	_id: string;
	_type: 'newsletterSubscriber';
	email: string;
	name?: string;
	_createdAt: string;
}


