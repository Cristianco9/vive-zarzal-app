// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY — Regular Expression Patterns
// Entity: Country | Table: pais
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the country record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the country name.
// The pattern accepts Unicode letters (supporting all scripts and accented
// characters), spaces, hyphens, and dots — covering official country names
// and multi-word designations in any language.
// The name must be unique per the database constraint and
// between 2 and 100 characters long.
export const name = /^[\p{L}\s\-.]{2,100}$/u;

// Regex pattern to validate the country description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,255}$/u;