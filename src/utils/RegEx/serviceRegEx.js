// ─────────────────────────────────────────────────────────────────────────────
// SERVICE — Regular Expression Patterns
// Entity: Service | Table: servicio
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the service record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the service name.
// The pattern accepts Unicode letters, digits, spaces, hyphens, dots,
// ampersands, and parentheses — covering diverse service titles
// in any language or script.
// The name must be between 2 and 200 characters long.
export const name = /^[\p{L}\p{N}\s\-&.()]{2,200}$/u;

// Regex pattern to validate the service description.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, and spaces for rich free-text content.
// The description is optional but, when provided, must be
// at least 10 characters long (stored as TEXT in the database).
export const description = /^[\p{L}\p{N}\p{P}\p{Z}\s]{10,}$/u;

// Regex pattern to validate the service price.
// The pattern ensures the value is a non-negative decimal number
// with up to 10 integer digits and up to 2 decimal places,
// matching the database DECIMAL(12, 2) column constraint.
// Examples of valid values: "0", "1500", "29.99", "1000000.00".
export const price = /^\d{1,10}(\.\d{1,2})?$/;

// Regex pattern to validate the foreign key referencing a Category record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const categoryId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a ServiceStatus record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const statusId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing an AgeRestriction record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
// This field is optional (allowNull: true in the model).
export const ageRestrictionId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Business record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const businessId = /^\d{1,10}$/;