// ─────────────────────────────────────────────────────────────────────────────
// LOCATION — Regular Expression Patterns
// Entity: Location | Table: ubicacion
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the location record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a City record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const cityId = /^\d{1,10}$/;

// Regex pattern to validate the location name.
// The pattern accepts Unicode letters, digits, spaces, hyphens, dots,
// commas, and the hash symbol (#) — covering typical Colombian address
// formats and named place references (e.g., "Calle 15 #3-20", "Local 4-B").
// The name must be between 3 and 150 characters long.
export const name = /^[\p{L}\p{N}\s\-.,#]{3,150}$/u;

// Regex pattern to validate the location description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces for free-text address context.
// The description is optional but, when provided, must be
// at least 5 characters long (stored as TEXT in the database).
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,}$/u;

// Regex pattern to validate the location postal or reference code.
// The pattern accepts uppercase and lowercase alphanumeric characters,
// spaces, and hyphens — supporting postal codes and internal reference
// identifiers up to 50 characters long.
export const code = /^[a-zA-Z0-9\s\-]{2,50}$/;