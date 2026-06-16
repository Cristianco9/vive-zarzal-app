// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS INDEX — Vive Zarzal API
// Central export for all Joi validation schemas
// ─────────────────────────────────────────────────────────────────────────────

// ── Geographic catalog ────────────────────────────────────────────────────────
export { countrySchema }            from './countrySchema.js';
export { departmentSchema }         from './departmentSchema.js';
export { citySchema }               from './citySchema.js';
export { locationSchema }           from './locationSchema.js';

// ── User catalog ─────────────────────────────────────────────────────────────
export { roleSchema }               from './roleSchema.js';
export { genderSchema }             from './genderSchema.js';
export { documentTypeSchema }       from './documentTypeSchema.js';

// ── User ─────────────────────────────────────────────────────────────────────
export { userSchema }               from './userSchema.js';
export { userImageSchema }          from './userImageSchema.js';
export { phoneSchema }              from './phoneSchema.js';
export { userPhoneSchema }          from './userPhoneSchema.js';

// ── Business ─────────────────────────────────────────────────────────────────
export { businessSchema }           from './businessSchema.js';
export { businessPhoneSchema }      from './businessPhoneSchema.js';

// ── Service ──────────────────────────────────────────────────────────────────
export { categorySchema }           from './categorySchema.js';
export { ageRestrictionSchema }     from './ageRestrictionSchema.js';
export { serviceStatusSchema }      from './serviceStatusSchema.js';
export { serviceSchema }            from './serviceSchema.js';
export { serviceImageSchema }       from './serviceImageSchema.js';

// ── Reservations ─────────────────────────────────────────────────────────────
export { reservationStatusSchema }  from './reservationStatusSchema.js';
export { reservationSchema }        from './reservationSchema.js';
export { reservationDetailsSchema } from './reservationDetailsSchema.js';

// ── Messaging ────────────────────────────────────────────────────────────────
export { messageStatusSchema }      from './messageStatusSchema.js';
export { messageSchema }            from './messageSchema.js';

// ── Reviews ──────────────────────────────────────────────────────────────────
export { businessReviewSchema }     from './businessReviewSchema.js';
export { serviceReviewSchema }      from './serviceReviewSchema.js';

// ── Favorites ────────────────────────────────────────────────────────────────
export { favoriteUserServiceSchema } from './favoriteUserServiceSchema.js';