import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { Accounts } from './swagger';
import { emailRegex } from '../utils/regex';

interface IAccounts extends Accounts, Document { }

const AccountsSchema = new Schema({
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    // email: { type: String, required: true, index: true, unique: true },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: (v) => {
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    active: { type: Boolean, required: true, default: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
    created_date: { type: Date, required: true, default: new Date() },
    phone: { type: String },
    office_phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
});

export const AccountsDB = model<IAccounts>('Accounts', AccountsSchema);

AccountsDB.ensureIndexes((err) => {
    if (err)
        logger.error('AccountsDB ensureIndexes error:', err);
});
