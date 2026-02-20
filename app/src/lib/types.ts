export interface Event {
	_id: string;
	_type: 'event';
	title: string;
	description?: string;
	date: string;
	location: string;
	imageUrl?: string | null;
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

export interface WorkshopType {
	_id: string;
	_type: 'workshop';
	title: string;
	slug?: { current: string };
	description?: string;
	shortDescription?: string;
	mainImage?: any;
	images?: Array<{ _key: string; asset: any; alt?: string }>;
	defaultPrice?: number;
	_createdAt: string;
	_updatedAt: string;
}

export interface WorkshopSession {
	_id: string;
	_type: 'workshopSession';
	workshop: { _ref: string } | WorkshopType;
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

/** Workshop type with its sessions (for list and detail pages). */
export interface WorkshopWithSessions extends WorkshopType {
	sessions: WorkshopSession[];
}

/** @deprecated Use WorkshopType + WorkshopSession. Kept for compatibility. */
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


