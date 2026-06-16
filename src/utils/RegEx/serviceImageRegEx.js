// ─────────────────────────────────────────────────────────────────────────────
// SERVICE IMAGE — Regular Expression Patterns
// Entity: ServiceImage | Table: imagen_servicio
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the service image record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the service image URL.
// The pattern ensures the URL starts with http:// or https://,
// is followed by a valid domain name, and ends with a common image
// file extension (.jpg, .jpeg, .png, .webp, .gif, .svg, .avif).
// Query strings and paths are permitted before the extension.
// The overall URL length must not exceed the TEXT column storage limit.
export const imageUrl = /^https?:\/\/[\w.-]{2,}\.[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?\.(?:jpe?g|png|webp|gif|svg|avif)$/i;

// Regex pattern to validate the service image description (alt text).
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 3 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{3,255}$/u;

// Regex pattern to validate the foreign key referencing a Service record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const serviceId = /^\d{1,10}$/;