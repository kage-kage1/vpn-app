import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod {
  id: string;
  name: string;
  logo: string;
  number: string;
  accountName: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface ISettings extends Document {
  paymentMethods: IPaymentMethod[];
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const SettingsSchema = new Schema<ISettings>({
  paymentMethods: [PaymentMethodSchema],
  siteName: {
    type: String,
    default: 'Kage VPN Store',
  },
  siteDescription: {
    type: String,
    default: 'Premium VPN Services',
  },
  contactEmail: {
    type: String,
    default: 'support@kagevpn.com',
  },
  contactPhone: {
    type: String,
    default: '09123456789',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);