import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import { testConnection } from './libraries/DBConnection.js';
import { setupAssociations } from './db/models/index.js';
import { loadCurrentUser } from './middlewares/auth.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import routes from './router/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

setupAssociations();

app.use(loadCurrentUser);
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export async function start() {
  await testConnection();

  const server = app.listen(config.appPort, () => {
    console.log(`Server running at http://localhost:${config.appPort}`);
  });

  return server;
}

const isMainModule =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  start().catch((error) => {
    console.error('Unable to start the application:', error);
    process.exit(1);
  });
}

export default app;
