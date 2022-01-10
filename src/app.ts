import * as express from 'express';
import * as bodyParser from 'body-parser';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as YAML from 'yamljs';
import * as cors from 'cors';
import * as favicon from 'serve-favicon';
import * as path from 'path';
import * as socket from 'socket.io';
import * as swaggerUi from 'swagger-ui-express';
import * as requestIP from 'request-ip';
import { Routes } from './routes';
import { logger } from './lib/logger';
import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import * as apiMetrics from 'prometheus-api-metrics';

dotenv.config();

const swaggerDocument = YAML.load('swagger.yml');
// export const config = YAML.load('config.yml');
export const config = process.env;


class App {

  public app: express.Application = express();
  private route: Routes = new Routes();
  private mongoUrl: string = 'mongodb://';
  public mongoConnection: typeof mongoose;
  // initialize to run constructor

  constructor() {
    this.configure();
    this.mongoSetup();

    // without proxy
    this.app.use('/api', this.route.routes(express()));
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(morgan('dev', {
      // to avoid healthcheck logs generates every 5 mins
      skip: (req) => {
        return req.originalUrl.includes('eks-elb-healthcheck') ||
          req.originalUrl.includes('metrics') ||
          req.originalUrl.includes('favicon');
      }
    }));
    this.app.use(compression());
    this.app.use(requestIP.mw());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(apiMetrics.expressMiddleware());
    this.app.use('/api', express.static(path.join(__dirname, '..', 'public')));
    this.app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    this.app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  // private prometheusSetup() {
  //   this.app.use(
  //     monitorMiddleware({
  //       host: '127.0.0.1',
  //       port: 9091,
  //       normalizePath: true,
  //       discardUnmatched: false
  //     })
  //   );
  // }

  private async mongoSetup() {
    if (config.MONGODB_AUTHENTICATION === 'true') {
      this.mongoUrl = this.mongoUrl + config.MONGODB_USER + ':' + encodeURIComponent(config.MONGODB_PASSWORD) + '@';
    }
    this.mongoUrl = this.mongoUrl + config.MONGODB_HOST + ':' + config.MONGODB_PORT + '/' + config.MONGODB_DB;

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected.');
    });
    this.mongoConnection = await mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
  }

}

export default new App();
