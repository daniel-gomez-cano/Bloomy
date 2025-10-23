import mongoose from 'mongoose'

const emailVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    code: { type: String, required: true }, // store as plain for simplicity; could hash
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Optional TTL index cleanup after 1 day
emailVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

export const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema)
