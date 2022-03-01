import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AccountJwtObject } from '../utils/interfaces';
import { Order, ResponseFormat } from '../models/swagger';
import { OrderDB } from '../models/orders';
import { ProductsDB } from '../models/products';

export class OrderController {

    private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
        if (statusCode)
            res.status(statusCode).json(response);
        else
            res.json(response);
    }

    async addOrder(req: Request, res: Response) {
        try {
            logger.debug('Add order:', req.body);
            if (!req.params.user_id) return this.sendResponse(res, 404, { success: false, message: 'UserId is Missing' });
            if (!req.body.cart_details || req.body.cart_details.length === 0) return this.sendResponse(res, 404, { success: false, message: 'Cart Is Empty' });
            if (!req.body.address_id) return this.sendResponse(res, 404, { success: false, message: 'Please Select the Address' });
            req.body.cart_details.forEach(async element => {
                if (!element.product_id || !element.price || !element.quantity) return this.sendResponse(res, 404, { success: false, message: 'Please check your cart' });
                await this.updateProductCount(element);
                // if (!checkProduct) return this.sendResponse(res, 404, { success: false, message: 'Please check your quantity' });
            });
            req.body.total_quantity = req.body.cart_details.reduce((initial, a) => initial + +a.quantity, 0);
            req.body.total_price = req.body.cart_details.reduce((initial, a) => initial + +a.price, 0);

            let orderData: Order = req.body;
            let orderDB = new OrderDB(orderData);
            let orderDetails = await orderDB.save();
            return this.sendResponse(res, 201, { success: true, message: 'Order Placed Successfully', data: orderDetails });


        } catch (error) {
            logger.error('Add order: failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

    async updateProductCount(product) {
        try {
            let productsData = await ProductsDB.findById(product.product_id).exec();
            if (productsData) {
                productsData.total_count = productsData.total_count - product.quantity
                await ProductsDB.findByIdAndUpdate(product.product_id, productsData).exec();
                // if (productsData.total_count < product.quantity) {
                //     return false;
                // } else {
                //     return true
                // }

            }
            //  else {
            //     return false;
            // }
        } catch (error) {
            logger.error('Add order: failed: ' + error);
            // return false;

        }
    }
    
    async getOrderById(req: Request, res: Response) {
        try {
            logger.debug('Get Order By Id', req.params.id);
            let orderDetails = await OrderDB.findById(req.params.id)
                .populate('user_id', 'first_name last_name email phone')
                .populate('address_id')
                .exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: orderDetails });
        } catch (error) {
            logger.error('Add order: failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }

    async updateOrderById(req: Request, res: Response) {
        try {
            logger.debug('Update Order Id: ' + req.params.id + ', Body', req.body);
            let update = req.body;
            let data = await OrderDB.findByIdAndUpdate(req.params.id, update).exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success' });
        } catch (error) {
            logger.error('Update Order Id failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
        }
    }

    async getOrdersByUserid(req: Request, res: Response) {
        try {
            logger.debug('Get Order By User Id', req.params.id);
            let orderDetails = await OrderDB.find({ 'user_id': req.params.id })
                .populate('user_id', 'first_name last_name email phone')
                .populate('address_id')
                .exec();
            return this.sendResponse(res, null, { success: true, message: 'Request Success', data: orderDetails });
        } catch (error) {
            logger.error('Add order: failed: ' + error);
            return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });

        }
    }




}
