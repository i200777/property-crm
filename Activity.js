import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);