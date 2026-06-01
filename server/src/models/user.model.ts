import mongoose, { Model } from 'mongoose';

//* User roles type
type UserRole = 'user' | 'admin';

//* Address interface
interface IAddress {
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

//* User interface
interface IUser extends mongoose.Document {
  clerkUserId: string;
  name: string;
  email: string;
  role: UserRole;
  addresses: IAddress[];
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

//* Address schema
const addressSchema = new mongoose.Schema<IAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
);

//* User schema
const userSchema = new mongoose.Schema<IUser>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Create the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export { User, type UserRole, type IUser };
