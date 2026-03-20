import mongoose, { Schema } from 'mongoose';

const AuroraQuestionSchema = new Schema({
  category: { type: String, required: true }, 
  questionText: { type: String, required: true },
  keywords: [{ type: String, required: true }],
  responseText: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AuroraQuestion || mongoose.model('AuroraQuestion', AuroraQuestionSchema);
