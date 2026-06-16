// ─────────────────────────────────────────────────────────────────────────────
// CITY — Regular Expression Patterns
// Entity: City | Table: ciudad
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the city record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Department record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const departmentId = /^\d{1,10}$/;

// Regex pattern to validate the city name.
// The pattern accepts Unicode letters (including accented characters),
// spaces, hyphens, and dots — accommodating multi-word and compound city names
// across different languages and writing systems.
// The name must be between 2 and 100 characters long.
export const name = /^[\p{L}\s\-.]{2,100}$/u;

// Regex pattern to validate the city description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,255}$/u;