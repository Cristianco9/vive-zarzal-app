// Import the ReservationServices class from the reservationServices module
import { ReservationServices } from '../../services/reservationService.js';

/**
 * Controller — PATCH /reservations/:id
 *
 * Updates an existing reservation. Only the owner of the reservation
 * (determined via its ReservationDetail records) may perform this action.
 * A 403 is returned by the service layer if the caller is not the owner.
 *
 * @param {Object}   req  - Express request. Expects :id in params and update data in body.
 * @param {Object}   res  - Express response.
 * @param {Function} next - Next middleware (error handler).
 * @returns {Promise<void>} 200 JSON confirming the update.
 */
export const updateOneReservation = async (req, res, next) => {

  // Extract the reservation ID from the route parameters
  const { id } = req.params;

  // Extract the update payload from the request body
  const newData = req.body;

  // Extract the authenticated user's ID from the JWT token
  const userId = req.user.id;

  try {
    // Instantiate the service manager
    const reservationManager = new ReservationServices();

    // Delegate the update to the service layer (ownership is enforced there)
    const result = await reservationManager.updateOne(Number(id), newData, userId);

    return res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: result,
      authentication: res.locals.newUserToken,
    });

  } catch (error) {
    // Forward the Boom error (400 / 403 / 404) or any unexpected error
    next(error);
  }
};