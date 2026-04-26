import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  propertyInterest: { type: String, required: true },
  budget: { type: Number, required: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Closed', 'Lost'],
    default: 'New',
  },
  source: {
    type: String,
    enum: ['Facebook Ads', 'Walk-in', 'Website', 'Referral', 'Other'],
    default: 'Other',
  },
  notes: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  score: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  followUpDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose 9 async middleware - NO next parameter
LeadSchema.pre('save', async function () {
  if (this.budget > 20000000) this.score = 'High';
  else if (this.budget >= 10000000) this.score = 'Medium';
  else this.score = 'Low';
  this.updatedAt = new Date();
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);