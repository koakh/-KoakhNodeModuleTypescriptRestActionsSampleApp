// tslint:disable: object-literal-sort-keys

// third party
import mongoose, { Document, Schema } from 'mongoose';
import c from '../../config/constants';

export interface IAudit extends Document {
  action: string;
  payload: any;
  result: string;
  error: string;
  createdDate: Date;
}

const options = { collection: c.MODEL_NAME_AUDIT };

export const AuditSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  result: {
    type: Object,
    required: false,
  },
  error: {
    type: Object,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, options);

// Export the model and return interface
export default mongoose.model<IAudit>(c.MODEL_NAME_AUDIT, AuditSchema);
