import { Document, Schema, model } from 'mongoose';
import { Users } from './swagger';
import { logger } from '../lib/logger';
import { emailRegex, phoneRegex, zipCodeRegex } from '../utils/regex';
import { postSaveHook } from '../utils/mongo-errors';

export interface IUsers extends Users, Document { }

const UsersSchema = new Schema({
  first_name: { type: String, sparse: true },
  last_name: { type: String, sparse: true },
  middle_name: { type: String },
  password: { type: String },
  active: { type: Boolean, required: true, default: true },
  created_date: { type: Date, required: true, default: new Date(), index: true },
  // populationsettings_id: { type: Schema.Types.ObjectId, ref: 'PopulationSettings', sparse: true },
  email: {
    type: String,
    sparse: true,
    unique: true,
    validate: {
      validator: (v) => {
        return emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    sparse: true,
    unique: true,
    validate: {
      validator: (v) => {
        return phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  phone_verified: { type: Boolean },
  office_phone: { type: String },
  home_phone: { type: String },
  address: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  county: { type: String },
  dob: { type: Date },
  gender: { type: String },
  ip_address: { type: String },

});
UsersSchema.pre<IUsers>('save', function (next) {
  // only hash the password if it has been modified (or is new)
  // if (!this.isModified('password')) return next();

  // this.password = 'hash';
  // next(new Error("hahah"));

  next();
});

UsersSchema.pre<IUsers>('updateOne', function (next) {
  next();
});

// for custom user friendly error message
UsersSchema.post<IUsers>('save', postSaveHook);
UsersSchema.post<IUsers>('updateOne', postSaveHook);

export const UsersDB = model<IUsers>('Users', UsersSchema);

UsersDB.ensureIndexes((err) => {
  if (err)
    logger.error('UsersDB ensureIndexes error:', err);
});