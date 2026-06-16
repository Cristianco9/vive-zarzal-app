// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT TYPE — Regular Expression Patterns
// Entity: DocumentType | Table: tipo_documento
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the document type record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the document type name.
// The pattern accepts Unicode letters, digits, spaces, hyphens, and dots —
// covering official identification document labels such as
// "Cédula de Ciudadanía", "Passport", or "Driver's License".
// The name must be unique per the database constraint and
// between 2 and 100 characters long.
export const name = /^[\p{L}\p{N}\s\-.]{2,100}$/u;