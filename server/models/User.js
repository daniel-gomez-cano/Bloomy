import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
