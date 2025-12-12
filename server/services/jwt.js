import jwt from 'jsonwebtoken'

const ACCESS_EXPIRES = process.env.JWT_EXPIRES || '7d' // session persists for this duration

export function signAccessToken(payload) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET')
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES })
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET')
  return jwt.verify(token, secret)
}

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const bearer = header.startsWith('Bearer ') ? header.slice(7) : null
    const token = bearer || req.cookies?.bloomy_token || req.cookies?.token || null
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const decoded = verifyToken(token)
    req.user = { id: decoded.sub, correo: decoded.correo }
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
