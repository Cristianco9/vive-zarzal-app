// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT — Regular Expression Patterns
// Entity: Department | Table: departamento
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the department record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Country record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const countryId = /^\d{1,10}$/;

// Regex pattern to validate the department name.
// The pattern accepts Unicode letters (including accented characters),
// spaces, hyphens, and dots — covering official administrative division
// names in any language or writing system.
// The name must be between 2 and 100 characters long.
export const name = /^[\p{L}\s\-.]{2,100}$/u;

// Regex pattern to validate the department description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,255}$/u;