import { Request, Response } from 'express';
import { config } from '../app';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Types, FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Users, ResponseFormat } from '../models/swagger';
import { IUsers, UsersDB } from '../models/users';

export class UserController {

  private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
    if (statusCode)
      res.status(statusCode).json(response);
    else
      res.json(response);
  }
}
