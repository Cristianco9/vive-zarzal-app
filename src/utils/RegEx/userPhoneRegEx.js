// ─────────────────────────────────────────────────────────────────────────────
// USER PHONE — Regular Expression Patterns
// Entity: UserPhone | Table: usuario_telefono
// Junction table linking User ↔ Phone records.
// All validatable fields are foreign-key integers; no string fields exist.
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the user-phone junction record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const userId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Phone record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const phoneId = /^\d{1,10}$/;