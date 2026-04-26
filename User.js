import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcryptjs.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);