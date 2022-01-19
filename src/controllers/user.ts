import { Request, Response } from 'express';
import { config } from '../app';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Types, FilterQuery } from 'mongoose';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Users, ResponseFormat, UserAddress } from '../models/swagger';
import { IUsers, UsersDB } from '../models/users';
import { ProductsDB } from '../models/products';
import { paginateQuery, getLookupQuery, queryFieldsIn } from '../lib/utlis';
import { ProductTypeDB } from '../models/product-type';
import { AccountJwtObject } from '../utils/interfaces';
import { RolesDB } from '../models/roles';
import { UserAddressDB, IUserAddress } from '../models/user-address';


export class UserController {

  private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
    if (statusCode)
      res.status(statusCode).json(response);
    else
      res.json(response);
  }

  async getAllProductByType(req: Request, res: Response) {
    logger.debug('Get all Product ');
    try {
      const { sort, skip, limit } = paginateQuery(req);
      let mongoQuery = {};
      mongoQuery['active'] = true;
      const { product_type_id } = req.query;
      if (product_type_id) { mongoQuery['product_type_id'] = product_type_id; }
      let count = await ProductsDB.countDocuments(mongoQuery).exec();
      let data = await ProductsDB.find(mongoQuery)
        .populate('product_type_id', 'name')
        .sort(sort)
        // .skip(skip)
        // .limit(limit)
        .exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success', data, count });
    } catch (error) {
      logger.error('Get all Product: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }
  async getAllProductType(req: Request, res: Response) {
    logger.debug('Get all Product ');
    try {
      const { sort, skip, limit } = paginateQuery(req);
      let mongoQuery = {};
      mongoQuery['active'] = true;
      let count = await ProductTypeDB.countDocuments(mongoQuery).exec();
      let data = await ProductTypeDB.find(mongoQuery)
        .populate('product_type_id', 'name')
        .sort(sort)
        // .skip(skip)
        // .limit(limit)
        .exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success', data, count });
    } catch (error) {
      logger.error('Get all Product: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }
  async getProductById(req: Request, res: Response) {
    try {
      logger.debug('Get  Product  By Id: ' + req.params.id);
      let productTypes = await ProductsDB.findById(req.params.id).exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success', data: productTypes });
    } catch (error) {
      logger.error('Get  Product  By Id: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

    }
  }

  async searchProduct(req: Request, res: Response) {
    logger.debug('Search Product ');
    try {
      const { search_string } = req.body;
      if (!search_string) return this.sendResponse(res, 400, { success: false, message: 'Invalid request.' });

      const { sort, skip, limit } = paginateQuery(req);
      let mongoQuery = {};
      mongoQuery['active'] = true;
      let aggregation = [
        // { $match: mongoQuery },
        { $match: { $or: queryFieldsIn(search_string, 'Products') } },
        {
          $facet: {
            data: [
              { $sort: sort },
            ],
            count: [
              { $count: 'count' },
            ],
          },
        },
      ];
      console.log(aggregation, "========================", JSON.stringify(queryFieldsIn(search_string, 'Products')))
      let [{ data, count }] = await UsersDB.aggregate(aggregation).exec();
      return this.sendResponse(res, 200, { success: true, message: 'Request Success', data, count: count[0] ? count[0].count : 0 });
    } catch (error) {
      logger.error('Get all Product: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      logger.debug('Login User', req.body);
      const { email, password } = req.body;
      if (!email || !password) return this.sendResponse(res, 400, { success: false, message: 'Invalid Request.' });
      // find user from db
      let user = await UsersDB.findOne({ email })
        .populate('role_id')
        .exec();
      if (user == null) {
        return this.sendResponse(res, 400, { success: false, message: 'Unknown Email.' });
      } else if (user.password !== password) {
        return this.sendResponse(res, 400, { success: false, message: 'Invalid Password.' });
      } else if (!user.active) {
        return this.sendResponse(res, 400, { success: false, message: 'Your user has been suspended. Please contact Super Admin.' });
      } else if (!user.role_id) {
        return this.sendResponse(res, 400, { success: false, message: 'Your Role is been deleted. Please contact Super Admin.' });
      } else {
        // generate jwt token
        let jwtObject: AccountJwtObject = {
          _id: user._id,
          full_name: user.first_name + ' ' + user.last_name,
          role_id: user.role_id._id,
          role_type: user.role_id.type,
        };
        const token = jwt.sign(jwtObject, config.JWT_USER_SECRET, { expiresIn: config.JWT_USER_EXPIRES_IN });
        let data = {
          user: user,
          role_type: user.role_id.type
        };
        return this.sendResponse(res, null, { success: true, message: 'Authentication successfully', token, data });
      }
    } catch (error) {
      logger.error('login User  failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

    }
  }

  async addUser(req: Request, res: Response) {
    try {
      logger.debug('Add User', req.body);
      let rolesData = await RolesDB.findOne({ name: "USER" }).exec();
      if (!rolesData) return this.sendResponse(res, 404, { success: false, message: 'Invalid Role' });
      req.body.role_id = rolesData._id;
      let user: Users = req.body;
      let userDB = new UsersDB(user);
      let newUser = await userDB.save();
      return this.sendResponse(res, 201, { success: true, message: 'User created successfully', data: newUser });

    } catch (error) {
      logger.error('Add User failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

    }
  }

  async addUserAddress(req: Request, res: Response) {
    try {
      logger.debug('Add User Address', req.body);
      if (!req.body.user_id) return this.sendResponse(res, 404, { success: false, message: 'User Id is Missing' });
      let useraddress: UserAddress = req.body;
      let useraddressDB = new UserAddressDB(useraddress);
      let newAddress = await useraddressDB.save();
      return this.sendResponse(res, 201, { success: true, message: 'User address created successfully', data: newAddress });

    } catch (error) {
      logger.error('Add User address failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

    }
  }

  async updateUserAddress(req: Request, res: Response) {
    try {

      logger.debug('Update User address Id: ' + req.params.id + ', Body', req.body);
      let update = req.body;
      let data = await UserAddressDB.findByIdAndUpdate(req.params.id, update).exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success' });

    } catch (error) {
      logger.error('Update User address: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

    }
  }
  async getUserAddressById(req: Request, res: Response) {
    try {
      logger.debug('Get User Address With Id: ' + req.params.id);
      let useraddress = await UserAddressDB.findById(req.params.id)
        .populate('user_id', 'first_name last_name email phone')
        .exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success', data: useraddress });
    } catch (error) {
      logger.error('Get User Address With Id failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }

  async updateUserAddressById(req: Request, res: Response) {
    try {
      logger.debug('Update User Address With Id: ' + req.params.id + ', Body', req.body);
      let update = req.body;
      let data = await UserAddressDB.findByIdAndUpdate(req.params.id, update).exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success' });
    } catch (error) {
      logger.error('Update User Address With Id: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }

  async deleteUserAddressById(req: Request, res: Response) {
    try {
      logger.debug('Delete User Address With Id: ' + req.params.id);
      let update = req.body;
      let data = await UserAddressDB.deleteOne({ _id: req.params.id }).exec();
      return this.sendResponse(res, null, { success: true, message: 'Request Success' });
    } catch (error) {
      logger.error('delete Product  Id failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }

}
