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

// Regex pattern to validate the business Facebook page URL or handle.
// The pattern accepts a full HTTPS URL pointing to facebook.com
// or a plain alphanumeric username/handle (3–100 characters).
export const facebook = /^(https:\/\/(www\.)?facebook\.com\/[\w.%-]{1,100}|[\w.%-]{3,100})$/;

// Regex pattern to validate the business Instagram profile URL or handle.
// The pattern accepts a full HTTPS URL pointing to instagram.com
// or a plain alphanumeric username preceded by an optional '@' (1–30 chars).
export const instagram = /^(https:\/\/(www\.)?instagram\.com\/[\w.%-]{1,100}|@?[\w.]{1,30})$/;

// Regex pattern to validate the business TikTok profile URL or handle.
// The pattern accepts a full HTTPS URL pointing to tiktok.com
// or a plain handle preceded by an optional '@' (2–24 chars).
export const tiktok = /^(https:\/\/(www\.)?tiktok\.com\/@[\w.%-]{2,24}|@?[\w.]{2,24})$/;

// Regex pattern to validate the business website URL.
// The pattern ensures the URL starts with http:// or https://,
// followed by a valid domain name and an optional path/query string,
// with an overall length between 10 and 255 characters.
export const website = /^https?:\/\/[\w.-]{2,}\.[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?$/;