/** Strips invisible/zero-width characters that sneak into CMS text fields. */
export const cleanText = (text: string | undefined | null): string | undefined | null => {
	if (!text) return text;
	// Remove zero-width characters, invisible separators, and other invisible Unicode chars
	return text
		.replace(/[​-‍﻿؜᠎]/g, '') // Zero-width characters
		.replace(/[⁠-⁩]/g, '') // Invisible operators and separators
		.replace(/[ - ]/g, '') // Various space characters
		.trim();
};
