import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AppConstants } from '../utils/app-constants';
import { Roles, ResponseFormat, ProductType } from '../models/swagger';
import { ProductTypeDB } from '../models/product-type'
import { ProductsDB } from 'models/products';

export class ProductTypeController {

    private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
        if (statusCode)
            res.status(statusCode).json(response);
        else
            res.json(response);
    }

    async addProductType(req: Request, res: Response) {
        try {
            logger.debug('Add product Type', req.body);
            let product: ProductType = req.body;
            let productTypeDB = new ProductTypeDB(product);
            let newProductType = await productTypeDB.save();
            return this.sendResponse(res, 201, { success: true, message: 'Product Type created successfully', data: newProductType });
        } catch (error) {
            logger.error('Add Product Type failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }

    async getAllProductType(req: Request, res: Response) {
        logger.debug('Get all Product Types');
        try {
            let productTypes = await ProductTypeDB.find().exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: productTypes });
        } catch (error) {
            logger.error('Get all Product Types: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

    async getProductTypeById(req: Request, res: Response) {
        try {
            logger.debug('Get  Product Type By Id: ' + req.params.id);
            let productTypes = await ProductTypeDB.findById(req.params.id).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: productTypes });
        } catch (error) {
            logger.error('Get  Product Type By Id: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }

    async updateProductById(req: Request, res: Response) {
        try {
            logger.debug('Update Product Type Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductTypeDB.findByIdAndUpdate(req.params.id, update).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('Update Product Type Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

    async deleteProductTypeId(req: Request, res: Response) {
        try {
            logger.debug('Delete Product Type Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductTypeDB.findByIdAndUpdate(req.params.id, { active: false }).exec();
            //let product = await ProductsDB.updateMany({ _id: req.params.id }, { $set: { active: false } }).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('delete Product Type Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }
    async restoreProductTypeId(req: Request, res: Response) {
        try {
            logger.debug('Restore Product Type Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await ProductTypeDB.findByIdAndUpdate(req.params.id, { active: true }).exec();
            //let product = await ProductsDB.updateMany({ _id: req.params.id }, { $set: { active: true } }).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('delete Product Type Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }



}
