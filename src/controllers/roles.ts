import { Request, Response } from 'express';
import { config } from '../app';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Types, FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Roles, ResponseFormat } from '../models/swagger';
import { RolesDB } from '../models/roles';

export class RoleController {

    private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
        if (statusCode)
            res.status(statusCode).json(response);
        else
            res.json(response);
    }

    async addRole(req: Request, res: Response) {
        try {
            logger.debug('Add Role', req.body);
            if (res.locals.jwtPayload.role_type === AppConstants.ROLE_SUPER_ADMIN) {
                let role: Roles = req.body;
                let roleDB = new RolesDB(role);
                let newRole = await roleDB.save();
                return this.sendResponse(res, 201, { success: true, message: 'Role created successfully', data: newRole });
            } else {
                return this.sendResponse(res, 400, { success: false, message: `You can't add role` });
            }
        } catch (error) {
            logger.error('Add Role failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }
    async getAllRoles(req: Request, res: Response) {
        logger.debug('Get all Roles');
        try {
            let roles = await RolesDB.find({ active: true }).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: roles });
        } catch (error) {
            logger.error('Get all Roles failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

}
