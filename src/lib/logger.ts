import { createLogger, transports, format } from 'winston';
import * as moment from 'moment';
import * as colors from 'colors';

export const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { level, message, ...args } = info;
          return `${colors.gray('[' + moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS') + ']')} - ${level}: ${message} ${Object.keys(args).length ? colors.yellow(': ' + JSON.stringify(args)) : ''}`;
        }),
      ),
    }),
  ],
});