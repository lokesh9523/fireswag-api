import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import App, { config } from './app';
import { logger } from './lib/logger';


let server = http.createServer(App.app).listen(config.PORT, () => {
  logger.info('Server listening on port: ' + config.PORT);
});