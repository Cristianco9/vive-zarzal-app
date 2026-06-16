// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE STATUS — Regular Expression Patterns
// Entity: MessageStatus | Table: estado_mensaje
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the message status record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the message status name.
// The pattern accepts Unicode letters, spaces, and hyphens,
// covering status labels such as "Sent", "Delivered", "Read",
// or "No leído" in any language or script.
// The name must be unique per the database constraint and
// between 2 and 50 characters long.
export const name = /^[\p{L}\s\-]{2,50}$/u;

// Regex pattern to validate the message status description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces.
// The description is optional but, when provided, must be
// between 5 and 255 characters long.
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{5,255}$/u;