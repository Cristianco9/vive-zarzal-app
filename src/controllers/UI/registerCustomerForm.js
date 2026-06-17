// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

/**
 * Controller function to render the register customer form page template.
 *
 * This function handles the request to display a register customer form page view to have access to
 * the application. Returning a response rendering a HTML template
 *
 * @param {Object} req - The request object containing the data sended in the request
 * @param {Object} res - The response rendering a HTML template a throw views template engine
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {html} - Return rendering a HTML template
 */
export const registerCustomerForm = async (req, res, next) => {
  try {
    // Extract the user full name that the middleware saved in req.user
    const userFullname = req.user?.fullName || 'Invitado';

    // Pass an isAuthenticated flag so the view can render login/logout appropriately
    const isAuthenticated = Boolean(req.user);

    // delete older cookie and render the register customer form page
    res.clearCookie('authentication').render('registerCustomerForm', {
      userFullname: userFullname,
      isAuthenticated: isAuthenticated
    });
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de página de registro de cliente',
      err);
    next(boomError);
  }
};