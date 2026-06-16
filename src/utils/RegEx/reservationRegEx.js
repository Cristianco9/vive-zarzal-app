// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION — Regular Expression Patterns
// Entity: Reservation | Table: reserva
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the reservation record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Service record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const serviceId = /^\d{1,10}$/;