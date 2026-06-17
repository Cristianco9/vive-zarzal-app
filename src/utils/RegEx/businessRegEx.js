// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS — Regular Expression Patterns
// Entity: Business | Table: negocio
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the business record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the business name.
// The pattern accepts Unicode letters, digits, spaces, hyphens,
// ampersands, and dots — covering trade names in any language.
// The name must be between 2 and 150 characters long.
export const name = /^[\p{L}\p{N}\s\-&.]{2,150}$/u;

// Regex pattern to validate the business description.
// The pattern accepts any printable Unicode content (letters, digits,
// punctuation, and spaces), allowing rich free-text descriptions.
// The description is optional but, when provided, must be
// at least 10 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{10,}$/u;

/**
 * Validates only the Facebook username/handle (no protocol or domain).
 * Allowed: letters, digits, dots, underscores, and hyphens.
 * Length: 3–100 characters.
 */
export const facebook = /^[A-Za-z0-9._-]{3,100}$/;

/**
 * Validates only the Instagram username (no protocol or domain).
 * Allows an optional '@' at the beginning.
 * Allowed: letters, digits, dots, and underscores.
 * Length: 1–30 characters.
 */
export const instagram = /^@?[A-Za-z0-9._]{1,30}$/;

/**
 * Validates only the TikTok username (no protocol or domain).
 * Allows an optional '@' at the beginning.
 * Allowed: letters, digits, dots, and underscores.
 * Length: 2–24 characters.
 */
export const tiktok = /^@?[A-Za-z0-9._]{2,24}$/;

/**
 * Validates domain names without the protocol (no http/https required).
 * Supports optional "www." prefix, subdomains, and an optional path.
 * Examples: "www.example.com", "my-site.co", "domain.org/profile"
 */
export const website = /^(?:www\.)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}(?:\/[^\s]*)?$/;