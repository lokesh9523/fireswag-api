import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { config } from '../app';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { ResponseFormat } from '../models/swagger';
import { SessionsDB } from '../models/sessions';
import { AccountJwtObject } from '../utils/interfaces';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers['fireswag-jwt-auth'];
  try {
    let jwtPayload = <AccountJwtObject>jwt.verify(token, config.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    logger.error(error);
    let responseFormat: ResponseFormat = { success: false, message: 'Invalid Session or Session expired.' };
    res.status(400).json(responseFormat);
    return;
  }
};