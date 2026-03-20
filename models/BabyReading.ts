import mongoose, { Schema } from 'mongoose';

const BabyReadingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fetalHeartRate: { type: Number, required: true },
  movementCount: { type: Number, required: true },
  contractionLevel: { type: Number, required: true },
  cervicalDilation: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.BabyReading || mongoose.model('BabyReading', BabyReadingSchema);
