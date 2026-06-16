// ─────────────────────────────────────────────────────────────────────────────
// USER IMAGE — Regular Expression Patterns
// Entity: UserImage | Table: imagen_usuario
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the user image record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const userId = /^\d{1,10}$/;

// Regex pattern to validate the user profile image URL.
// The pattern ensures the URL starts with http:// or https://,
// is followed by a valid domain name, and ends with a common image
// file extension (.jpg, .jpeg, .png, .webp, .gif, .svg, .avif).
// The overall URL length must not exceed 500 characters,
// matching the database STRING(500) column constraint.
export const url = /^https?:\/\/[\w.-]{2,}\.[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?\.(?:jpe?g|png|webp|gif|svg|avif)$/i;

// Regex pattern to validate the image display name.
// The pattern accepts Unicode letters, digits, spaces, hyphens, dots,
// and underscores — covering typical image filenames and descriptive labels.
// The name is optional but, when provided, must be
// between 2 and 255 characters long.
export const name = /^[\p{L}\p{N}\s\-._]{2,255}$/u;

// Regex pattern to validate the image alternative text (alt attribute).
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces — supporting descriptive accessibility text.
// The alt text is optional but, when provided, must be
// between 3 and 255 characters long.
export const altText = /^[\p{L}\p{N}\p{P}\p{Z}\s]{3,255}$/u;