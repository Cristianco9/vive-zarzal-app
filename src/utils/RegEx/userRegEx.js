// ─────────────────────────────────────────────────────────────────────────────
// USER — Regular Expression Patterns
// Entity: User | Table: usuario
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the user record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Role record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const roleId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Gender record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
// This field is optional (allowNull: true in the model).
export const genderId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a DocumentType record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
// This field is optional (allowNull: true in the model).
export const documentTypeId = /^\d{1,10}$/;

// Regex pattern to validate the user first name.
// The pattern ensures the first name contains only Unicode letters
// (supporting accented characters and international scripts)
// and is between 2 and 100 characters long.
export const firstName = /^[\p{L}]{2,100}$/u;

// Regex pattern to validate the user last name.
// The pattern ensures the last name contains only Unicode letters
// (supporting accented characters and international scripts)
// and is between 2 and 100 characters long.
export const lastName = /^[\p{L}]{2,100}$/u;

// Regex pattern to validate the user birth date in ISO 8601 format (YYYY-MM-DD).
// The pattern checks for a plausible calendar date:
// years from 1900 to 2099, months 01–12, and days 01–31.
// Note: further semantic validation (leap years, month lengths)
// should be handled at the application or database layer.
export const birthDate = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Regex pattern to validate the user document (ID) number.
// The pattern accepts alphanumeric characters and hyphens,
// supporting national identity documents, passports, and other formats
// (e.g., "1234567890", "AB-1234567", "79543210").
// The document number must be between 5 and 30 characters long,
// matching the database STRING(30) column constraint.
export const documentNumber = /^[a-zA-Z0-9\-]{5,30}$/;

// Regex pattern to validate the user email address.
// The pattern ensures the email contains only letters (both uppercase
// and lowercase), digits, and special characters (._%+-),
// followed by the domain format *@domain.tld.
export const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;

// Regex pattern to validate the user username.
// The pattern ensures the username contains only letters
// (both uppercase and lowercase), digits (0–9),
// and the special characters (. - _).
// The username must be unique per the database constraint and
// between 3 and 80 characters long, matching the STRING(80) column.
export const username = /^[a-zA-Z0-9._-]{3,80}$/;

// Regex pattern to validate the user password (plain text before hashing).
// The pattern requires at least one letter and at least one digit,
// allowing any combination of letters, digits, and common symbols.
// The password must be between 8 and 30 characters long.
export const password = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&._\-#]{8,30}$/;