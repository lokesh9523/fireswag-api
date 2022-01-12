import { Request, Response } from 'express';
import { config } from '../app';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Types, FilterQuery } from 'mongoose';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Users, ResponseFormat } from '../models/swagger';
import { IUsers, UsersDB } from '../models/users';
import { ProductsDB } from '../models/products';
import { paginateQuery } from '../lib/utlis';
import { ProductTypeDB } from '../models/product-type'

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

}
