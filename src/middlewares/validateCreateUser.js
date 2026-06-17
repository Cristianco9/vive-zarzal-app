import { flatNewUserDataSchema, businessSchema } from '../schemas/userSchema.js';

/**
 * Middleware to validate payloads for creating users (regular and advertiser).
 * - If req.body.newUserData exists: validate req.body.newUserData and (optionally) req.body.business
 * - Otherwise: validate req.body as flat new user object
 */
export default function validateCreateUser(req, res, next) {
  try {
    const body = req.body || {};

    // Case: wrapped advertiser payload
    if (body && typeof body === 'object' && body.newUserData) {
      const { error: userErr } = flatNewUserDataSchema.validate(body.newUserData, { abortEarly: false });
      if (userErr) {
        const messages = userErr.details.map(d => d.message);
        return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: messages.join(', ') });
      }

      if (body.business) {
        const { error: businessErr } = businessSchema.validate(body.business, { abortEarly: false });
        if (businessErr) {
          const messages = businessErr.details.map(d => d.message);
          return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: messages.join(', ') });
        }
      }

      // Validated wrapped payload -> proceed
      return next();
    }

    // Case: flat user object in root
    const { error } = flatNewUserDataSchema.validate(body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: messages.join(', ') });
    }

    return next();
  } catch (err) {
    console.error('validateCreateUser middleware error:', err);
    return res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: 'Validation middleware failed' });
  }
}