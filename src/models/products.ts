import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { Products } from './swagger';

interface IProducts extends Products, Document { };

const ProductsSchema = new Schema({
    product_type_id: { type: Schema.Types.ObjectId, ref: 'ProductType', required: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: String },
    total_count: { type: Number, required: true },
    pre_booking: { type: Boolean, default: false },
    image_url: { type: String, required: true },
    pre_booking_price: { type: String },
    last_updated: { type: Date, required: true, default: new Date() }
});

export const ProductsDB = model<IProducts>('Products', ProductsSchema);

ProductsDB.ensureIndexes((err) => {
    if (err)
        logger.error('RolesDB ensureIndexes error:', err);
});