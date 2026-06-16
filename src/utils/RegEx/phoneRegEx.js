// ─────────────────────────────────────────────────────────────────────────────
// PHONE — Regular Expression Patterns
// Entity: Phone | Table: telefono
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the phone record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate an international phone number.
// The pattern accepts an optional leading '+' followed by digits, spaces,
// hyphens, and parentheses — covering national and international formats
// such as "+57 310 123 4567", "(601) 234-5678", or "3101234567".
// The number must be between 7 and 20 characters long,
// matching the database STRING(20) column constraint.
export const phoneNumber = /^\+?[\d\s\-().]{7,20}$/;