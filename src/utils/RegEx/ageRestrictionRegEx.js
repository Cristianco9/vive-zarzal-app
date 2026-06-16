// ─────────────────────────────────────────────────────────────────────────────
// AGE RESTRICTION — Regular Expression Patterns
// Entity: AgeRestriction | Table: restriccion_edad
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the age restriction record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long, supporting up to 1,000,000,000 records.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the age restriction name.
// The pattern ensures the name contains only Unicode letters and spaces,
// supports accented characters and international scripts,
// and is between 3 and 100 characters long.
export const name = /^[\p{L}\s]{3,100}$/u;

// Regex pattern to validate the age restriction description.
// The pattern accepts any printable Unicode character including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}]{5,255}$/u;