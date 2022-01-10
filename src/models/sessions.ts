import { Document, Schema, model } from 'mongoose';
import { logger } from '../lib/logger';
import { Sessions } from './swagger';

interface ISessions extends Sessions, Document { }

const SessionsSchema = new Schema({
  account_id: { type: Schema.Types.ObjectId, ref: 'accounts', required: true, index: true },
  ip_address: { type: String, required: true },
  login_time: { type: Date, required: true },
  last_active_time: { type: Date, required: true },
  status: { type: String, required: true },
});

export const SessionsDB = model<ISessions>('Sessions', SessionsSchema);

SessionsDB.ensureIndexes((err) => {
  if (err)
    logger.error('SessionsDB ensureIndexes error:', err);
});