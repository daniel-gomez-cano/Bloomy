import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // passwordHash es obligatorio solo para usuarios con proveedor 'local'
    passwordHash: { type: String, required: function () { return this.provider !== 'google' } },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, default: null },
    picture: { type: String, default: null },
  isPremium: { type: Boolean, default: false },
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
