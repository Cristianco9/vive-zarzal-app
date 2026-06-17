// Import the Router class from Express
import { Router } from "express";

// Import the UIRouter for handling user-interface-related routes
import { UIRouter } from "./UIRouter.js";

// Import subrouters
import { ageRestrictionRouter } from "./ageRestrictionRouter.js";
import { businessReviewRouter } from "./BusinessReviewRouter.js";
import { businessRouter } from "./businessRouter.js";
import { categoryRouter } from "./categoryRouter.js";
import { cityRouter } from "./cityRouter.js";
import { countryRouter } from "./countryRouter.js";
import { departmentRouter } from "./departmentRouter.js";
import { documentTypeRouter } from "./documentTypeRouter.js";
import { favoriteUserServiceRouter } from "./favoriteUserServiceRouter.js";
import { genderRouter } from "./genderRouter.js";
import { locationRouter } from "./locationRouter.js";
import { messageRouter } from "./messageRouter.js";
import { messageStatusRouter } from "./messageStatusRouter.js";
import { phoneRouter } from "./phoneRouter.js";
import { reservationsRouter } from "./reservationsRouter.js";
import { reservationStatusRouter } from "./reservationStatusRouter.js";
import { roleRouter } from "./roleRouter.js";
import { serviceImageRouter } from "./serviceImageRouter.js";
import { serviceReviewRouter } from "./serviceReviewRouter.js";
import { serviceRouter } from "./serviceRouter.js";
import { serviceStatusRouter } from "./serviceStatusRouter.js";
import { userImageRouter } from "./userImageRouter.js";
import { userRouter } from "./userRouter.js";

// Function to set up API routes
const routerApi = (app) => {

  // Create a new Router instance
  const router = Router();

  // Use the router instance for the '/app/v1' path
  app.use('/app/v1', router);

  // UI
  router.use('/', UIRouter);

  // Catalog routes
  router.use('/age-restrictions', ageRestrictionRouter);
  router.use('/businesses', businessRouter);
  router.use('/business-reviews', businessReviewRouter);
  router.use('/categories', categoryRouter);
  router.use('/cities', cityRouter);
  router.use('/countries', countryRouter);
  router.use('/departments', departmentRouter);
  router.use('/document-types', documentTypeRouter);
  router.use('/favorite-user-services', favoriteUserServiceRouter);
  router.use('/genders', genderRouter);
  router.use('/locations', locationRouter);
  router.use('/messages', messageRouter);
  router.use('/message-statuses', messageStatusRouter);
  router.use('/phones', phoneRouter);
  router.use('/reservation', reservationsRouter);
  router.use('/reservation-statuses', reservationStatusRouter);
  router.use('/roles', roleRouter);
  router.use('/service-images', serviceImageRouter);
  router.use('/service-reviews', serviceReviewRouter);
  router.use('/services', serviceRouter);
  router.use('/service-statuses', serviceStatusRouter);
  router.use('/user-images', userImageRouter);
  router.use('/users', userRouter);
};

// Export the routerApi function for use in other parts of the application
export default routerApi;