import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { Order } from './swagger';

interface IOrder extends Order, Document { };

const cartDetails = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    discount: { type: String },
});

const OrderSchema = new Schema({
    user_id:{type:Schema.Types.ObjectId,ref:'Users',required:true},
    address_id: { type: Schema.Types.ObjectId, ref: 'UserAddress', required: true },
    total_price: { type: String, required: true },
    total_quantity: { type: String, required: true },
    discount: { type: String },
    created_date: { type: Date, required: true, default: new Date() },
    cart_details: { type: cartDetails, required: true },
    status:{type:String,default:"PLACED"}
});

export const OrderDB = model<IOrder>('Order', OrderSchema);

OrderDB.ensureIndexes((err) => {
    if (err)
        logger.error('OrderDB ensureIndexes error:', err);
});