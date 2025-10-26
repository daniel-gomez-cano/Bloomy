import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

export const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)
