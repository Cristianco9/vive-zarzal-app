// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION DETAIL — Regular Expression Patterns
// Entity: ReservationDetail | Table: reserva_detalle
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the reservation detail record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Reservation record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const reservationId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const userId = /^\d{1,10}$/;

// Regex pattern to validate the quantity of spots or items reserved.
// The pattern ensures the value is a positive integer between 1 and 9999,
// matching the database validate.min: 1 constraint and
// a reasonable upper limit for a single reservation detail.
export const quantity = /^(?:[1-9]\d{0,3})$/;

// Regex pattern to validate the foreign key referencing a ReservationStatus record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const reservationStatusId = /^\d{1,10}$/;