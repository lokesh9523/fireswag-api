import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { UserAddress } from './swagger';

export interface IUserAddress extends UserAddress, Document { }

const UserAddressSchema = new Schema({
    created_date: { type: Date, required: true, default: new Date(), index: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    office_phone: { type: String },
    home_phone: { type: String },
    address: { type: String },
    address2: { type: String },
    city: { type: String,required:true },
    state: { type: String,required:true },
    country: { type: String,required:true },

});

export const UserAddressDB = model<IUserAddress>('UserAddress', UserAddressSchema);

UserAddressDB.ensureIndexes((err) => {
    if (err)
        logger.error('UserAddressDB ensureIndexes error:', err);
});