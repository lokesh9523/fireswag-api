import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { ProductType } from './swagger';

interface IProductType extends ProductType, Document { };


const ProductTypeSchema = new Schema({
    name: {
        type: String, required: true,
        sparse: true,
        unique: true,
    },
    active: { type: Boolean, required: true, default: true },
    last_updated: { type: Date, required: true, default: new Date() }
});

export const ProductTypeDB = model<IProductType>('ProductType', ProductTypeSchema);

ProductTypeDB.ensureIndexes((err) => {
    if (err)
        logger.error('RolesDB ensureIndexes error:', err);
});