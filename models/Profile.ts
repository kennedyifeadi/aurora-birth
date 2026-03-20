import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  pregnancyStartDate: { type: Date },
  gestationalAgeDays: { type: Number },
  medications: [{ type: String }],
  allergies: [{ type: String }],
  gravidity: { type: Number }, 
  parity: { type: Number },    
  phoneNumber: { type: String },
  doctor: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
