// ─────────────────────────────────────────────────────────────────────────────
// GENDER — Regular Expression Patterns
// Entity: Gender | Table: genero
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the gender record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the gender type label.
// The pattern accepts Unicode letters, spaces, and hyphens,
// supporting labels in any language or script
// (e.g., "Male", "Female", "Non-binary", "No especificado").
// The name must be unique per the database constraint and
// between 2 and 50 characters long.
export const name = /^[\p{L}\s\-]{2,50}$/u;