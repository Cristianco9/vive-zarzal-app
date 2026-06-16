// ─────────────────────────────────────────────────────────────────────────────
// SERVICE REVIEW — Regular Expression Patterns
// Entity: ServiceReview | Table: resena_servicio
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the service review record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Service record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const serviceId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const userId = /^\d{1,10}$/;

// Regex pattern to validate the service review content body.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, spaces, and newline-equivalent whitespace,
// supporting multi-language free-text reviews.
// The content is optional but, when provided, must be
// between 10 and 5000 characters long.
export const content = /^[\p{L}\p{N}\p{P}\p{Z}\s]{10,5000}$/u;

// Regex pattern to validate the numerical rating of the review.
// The pattern ensures the rating is a single digit between 1 and 5,
// matching the database SMALLINT constraint (min: 1, max: 5).
export const rating = /^[1-5]$/;