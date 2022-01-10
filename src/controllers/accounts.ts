import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../app';
import { logger } from '../lib/logger';
import { AccountJwtObject } from '../utils/interfaces';
import { AppConstants } from '../utils/app-constants';
import { Roles, Sessions, Accounts, ResponseFormat } from '../models/swagger';
import { RolesDB } from '../models/roles';
import { AccountsDB } from '../models/accounts';
import { SessionsDB } from '../models/sessions';

export class AccountsController {

    private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
        if (statusCode)
            res.status(statusCode).json(response);
        else
            res.json(response);
    }

    async addAccount(req: Request, res: Response) {
        try {
            logger.debug('Add Account', req.body);
            if (res.locals.jwtPayload.role_type === AppConstants.ROLE_SUPER_ADMIN) {
                let rolesData = await RolesDB.findOne({ name: req.body.role }).exec();
                if (!rolesData) return this.sendResponse(res, 404, { success: false, message: 'Invalid Role' });
                req.body.role_id = rolesData._id;
                let account: Accounts = req.body;
                let accountDB = new AccountsDB(account);
                let newAccount = await accountDB.save();
                return this.sendResponse(res, 201, { success: true, message: 'Account created successfully', data: newAccount });
            } else {
                return this.sendResponse(res, 400, { success: false, message: `You can't add account` });
            }

        } catch (error) {
            logger.error('Add Account failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }
    async loginAccount(req: Request, res: Response) {
        try {
            logger.debug('Login Account', req.body);
            const { email, password } = req.body;
            if (!email || !password) return this.sendResponse(res, 400, { success: false, message: 'Invalid Request.' });
            // find account from db
            let account = await AccountsDB.findOne({ email })
                .populate('role_id')
                .exec();
            if (account == null) {
                return this.sendResponse(res, 400, { success: false, message: 'Unknown Email.' });
            } else if (account.password !== password) {
                return this.sendResponse(res, 400, { success: false, message: 'Invalid Password.' });
            } else if (!account.active) {
                return this.sendResponse(res, 400, { success: false, message: 'Your account has been suspended. Please contact Super Admin.' });
            } else if (!account.role_id) {
                return this.sendResponse(res, 400, { success: false, message: 'Your Role is been deleted. Please contact Super Admin.' });
            } else {
                // generate jwt token
                let jwtObject: AccountJwtObject = {
                    _id: account._id,
                    full_name: account.first_name + ' ' + account.last_name,
                    // partner_id: account.client_id ? account.client_id.partner_id : undefined,
                    role_id: account.role_id._id,
                    role_type: account.role_id.type,
                };
                const token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
                let data = {
                    account: account,
                    role_type: account.role_id.type
                };
                return this.sendResponse(res, null, { success: true, message: 'Authentication successfully', token, data });
            }
        } catch (error) {
            logger.error('login Account  failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }

    async getAccountById(req: Request, res: Response) {
        try {
            logger.debug('Get Account With Id: ' + req.params.id);
            let account = await AccountsDB.findById(req.params.id)
                .populate('role_id', 'name')
                .exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: account });
        } catch (error) {
            logger.error('Get Account With Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }
    async updateAccountById(req: Request, res: Response) {
        try {
            logger.debug('Update Account Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await AccountsDB.findByIdAndUpdate(req.params.id, update).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('Update Account Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }


}
