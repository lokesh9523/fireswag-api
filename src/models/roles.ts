import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { Roles } from './swagger';

interface IRoles extends Roles, Document { };


const RolesSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  last_updated: { type: Date, required: true, default: new Date() }
});

export const RolesDB = model<IRoles>('Roles', RolesSchema);

RolesDB.ensureIndexes((err) => {
  if (err)
    logger.error('RolesDB ensureIndexes error:', err);
});