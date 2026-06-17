export default function setCurrentPath(req, res, next) {
  // Use originalUrl to preserve full path including mounted base paths and query path not included
  res.locals.currentPath = req.originalUrl || req.url || '/';
  next();
}