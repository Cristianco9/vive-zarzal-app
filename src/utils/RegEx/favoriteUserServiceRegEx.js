// ─────────────────────────────────────────────────────────────────────────────
// FAVORITE USER SERVICE — Regular Expression Patterns
// Entity: ServiceFavorite | Table: servicio_favoritos_usuarios
// Junction table linking User ↔ Service for the favourites feature.
// All validatable fields are foreign-key integers; no string fields exist.
// ─────────────────────────────────────────────────────────────────────────────

// Regex pattern to validate the service-favorite record identifier.
// The pattern ensures the ID is a positive integer
// between 1 and 10 digits long.
export const ID = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a User record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const userId = /^\d{1,10}$/;

// Regex pattern to validate the foreign key referencing a Service record.
// The pattern ensures the value is a positive integer
// between 1 and 10 digits long.
export const serviceId = /^\d{1,10}$/;