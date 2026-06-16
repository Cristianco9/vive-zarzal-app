// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY — Regular Expression Patterns
// Entity: Category | Table: categoria
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the category record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the category name.
// The pattern accepts Unicode letters, digits, spaces, hyphens, and ampersands,
// supporting category labels written in any language.
// The name must be unique per the database constraint and
// between 2 and 100 characters long.
export const name = /^[\p{L}\p{N}\s\-&]{2,100}$/u;

// Regex pattern to validate the category description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces for rich free-text content.
// The description is optional but, when provided, must be
// at least 5 characters long with no upper-bound restriction
// (stored as TEXT in the database).
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,}$/u;