import mongoose from 'mongoose';

const QASchema = new mongoose.Schema({
  question: { type: String, required: true },
  keywords: [{ type: String, required: true }], // Array of matching variations
  response: { type: String, required: true },
  category: { type: String, default: 'GENERAL' }, // e.g., MOVEMENT, PAIN, DISCOMFORT
});

export default mongoose.models.QA || mongoose.model('QA', QASchema);
