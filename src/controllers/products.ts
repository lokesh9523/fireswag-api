import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Roles, ResponseFormat, ProductType, Products } from '../models/swagger';
import { ProductTypeDB } from '../models/product-type';
import { ProductsDB } from '../models/products';
import { paginateQuery } from '../lib/utlis';

export class ProductsController {

    private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
        if (statusCode)
            res.status(statusCode).json(response);
        else
            res.json(response);
    }

    async addProduct(req: Request, res: Response) {
        try {
            logger.debug('Add product Type', req.body);
            const { product_type_id, name, description, price, total_count, pre_booking, image_url } = req.body;
            if (!product_type_id || !name || !description || !price || !total_count || !pre_booking || !image_url) return this.sendResponse(res, 400, { success: false, message: 'Invalid Request.' });
            let product: ProductType = req.body;
            let productsDB = new ProductsDB(product);
            let newProducts = await productsDB.save();
            return this.sendResponse(res, 201, { success: true, message: 'Product  created successfully', data: newProducts });
        } catch (error) {
            logger.error('Add Product Type failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }

    async getAllProductByType(req: Request, res: Response) {
        logger.debug('Get all Product ');
        try {
            const { sort, skip, limit } = paginateQuery(req);
            let mongoQuery = {};
            const { product_type_id } = req.query;
            if (product_type_id) { mongoQuery['product_type_id'] = product_type_id; }
            let count = await ProductsDB.countDocuments(mongoQuery).exec();
            let data = await ProductsDB.find(mongoQuery)
                .populate('product_type_id', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit)
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

    async updateProductById(req: Request, res: Response) {
        try {
            logger.debug('Update Product Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductsDB.findByIdAndUpdate(req.params.id, update).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('Update Product  Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

    async deleteProductById(req: Request, res: Response) {
        try {
            logger.debug('Delete Product Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductsDB.findByIdAndUpdate(req.params.id, { active: false }).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('delete Product  Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }
    async restoreProductById(req: Request, res: Response) {
        try {
            logger.debug('Restore Product Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductsDB.findByIdAndUpdate(req.params.id, { active: true }).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('delete Product Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }



}
