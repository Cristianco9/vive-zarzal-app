// ─────────────────────────────────────────────────────────────────────────────
// ROLE — Regular Expression Patterns
// Entity: Role | Table: rol
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the role record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the role type label.
// The pattern accepts Unicode letters, spaces, and underscores —
// covering system role identifiers such as "Admin", "Business Owner",
// "Client", or "Super_Admin" in any language.
// The name must be unique per the database constraint and
// between 2 and 50 characters long.
export const name = /^[\p{L}\s_]{2,50}$/u;

// Regex pattern to validate the role description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces for human-readable role definitions.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,255}$/u;