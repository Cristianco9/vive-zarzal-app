// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE — Regular Expression Patterns
// Entity: Message | Table: mensaje
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the message record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the message content body.
// The pattern accepts any printable Unicode characters including letters,
// digits, punctuation, spaces, and common symbols,
// supporting free-text conversation messages in any language.
// The content is required (allowNull: false) and must be
// between 1 and 10,000 characters long.
export const content = /^[\p{L}\p{N}\p{P}\p{Z}\p{S}\s]{1,10000}$/u;

// Regex pattern to validate the foreign key referencing a MessageStatus record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const statusId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing the sender User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const senderUserId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing the receiver User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const receiverUserId = /^\d{1,10}$/;