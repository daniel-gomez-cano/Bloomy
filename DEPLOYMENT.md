# Bloomy Deployment Guide (100% Free Stack)

This document provides a step-by-step path to deploy the Bloomy MERN app (frontend + backend) with: MongoDB Atlas (free), Stripe (test mode), Google Sign-In, Gemini API, email verification, and JWT auth. Focus is on a free, maintainable setup.

## Overview of Recommended Setup
- Frontend: Vercel (Hobby, free) or Netlify (free). Vite build -> static assets.
- Backend (Express + Stripe webhook + Gemini): Render (Free Web Service) or Railway (if credits suffice). Render free tier sleeps after inactivity; ok for academic use.
- Database: MongoDB Atlas Free (Shared M0 cluster).
- Email: Resend (free dev), SendGrid trial, or Mailgun sandbox. Replace current email send logic with chosen provider credentials.
- Stripe: Test mode only (no cost). Webhook endpoint configured to deployed backend.
- Google OAuth / One Tap: Google Cloud Console credentials with authorized origins.
- Gemini API: Google AI Studio free quota.

You can deploy both frontend and backend on Render (frontend as static site) if you prefer one platform. Mixed approach (Vercel + Render) is common.

## 1. Prepare Repository Structure
Current structure:
```
root/
  server/  (Express API)
  client/bloomy-project/ (Vite React frontend)
```
No change required. Ensure `.env` files are NOT committed with secrets.

## 2. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com and create free cluster (Region near you).
2. Create a database user: username/password.
3. Network Access: Allow Access From Anywhere (0.0.0.0/0) for simplicity or add Render/Vercel IP ranges later.
4. Get connection string (looks like `mongodb+srv://USER:PASS@CLUSTER.mongodb.net/bloomy?retryWrites=true&w=majority`). Add database name (e.g. `bloomy`).
5. Set `MONGO_URI` in backend environment.

## 3. Stripe Setup (Test Mode)
1. Create Stripe account.
2. Obtain keys: `STRIPE_SECRET_KEY` and publishable key (publishable is used client-side if needed).
3. In Stripe Dashboard, create a Product & Price (if not already). Set `STRIPE_PRICE_ID` to that price id.
4. After backend deploy, add webhook endpoint: `https://<backend-domain>/api/stripe/webhook` listening to relevant events (e.g. `checkout.session.completed`). Copy generated `WEBHOOK_SIGNING_SECRET` -> set `STRIPE_WEBHOOK_SECRET`.

## 4. Google OAuth / One Tap Setup
1. Visit Google Cloud Console → Credentials → Create OAuth Client ID (type Web Application).
2. Authorized JavaScript origins: `https://<frontend-domain>` (and localhost for dev `http://localhost:5173`).
3. Copy `GOOGLE_CLIENT_ID` → backend (for verification) and frontend (`VITE_GOOGLE_CLIENT_ID`) if needed by the client code.
4. If using One Tap, ensure the domain is added to consent screen & production.

## 5. Gemini API Setup
1. Generate API key in Google AI Studio.
2. Set `GOOGLE_API_KEY` in backend.
3. Optional: `GOOGLE_MODEL` (already defaults to `gemini-2.5-flash`).

## 6. Email Provider Setup
Pick one:
- Resend: Add `RESEND_API_KEY` and use their API (requires minor code adaptation if currently using SMTP).
- SendGrid: `SENDGRID_API_KEY`.
- Mailgun: `MAILGUN_API_KEY`, domain, and sandbox variables.
If you are using raw SMTP now, set:
```
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=
EMAIL_SMTP_USER=
EMAIL_SMTP_PASS=
EMAIL_FROM=Bloomy <no-reply@yourdomain>
```
Consider switching to a provider library for reliability.

## 7. JWT & Security Variables
Add in backend:
```
JWT_SECRET=<long random string>
COOKIE_NAME=bloomy_token (if configurable)
CLIENT_ORIGINS=https://<frontend-domain>,http://localhost:5173
```
Keep `JWT_SECRET` private.

## 8. Backend Deployment (Render Example)
You can use either TWO services (recommended simplicity) or ONE combined service (single domain).

### Option A: Two Services (API + Static Frontend)
1. Create a Web Service for backend:
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `node index.js`
2. Create a Static Site for frontend:
  - Root Directory: `client/bloomy-project`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
3. Set env vars only on backend service (frontend just needs `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`).
4. Set `VITE_API_URL` on frontend to backend URL.

### Option B: Single Service (Serve Frontend From Express)
1. In Render, create one Web Service pointing to root directory `.`
2. Build Command (monorepo):
  ```bash
  cd client/bloomy-project && npm install && npm run build && cd ../../server && npm install
  ```
3. Start Command:
  ```bash
  node index.js
  ```
4. Set env var `SERVE_CLIENT=true` so Express serves `dist` (already coded in `server/index.js`).
5. Ensure client build output ends up at `client/bloomy-project/dist` (Render keeps build artifacts).
6. Omit static site service; single domain handles everything.

Environment Variables (Render dashboard):
```
PORT=10000 (Render sets PORT automatically; can omit)
MONGO_URI=...
CLIENT_ORIGINS=https://<frontend-domain>,http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
GOOGLE_API_KEY=...
GOOGLE_MODEL=gemini-2.5-flash
GOOGLE_CLIENT_ID=...
JWT_SECRET=...
EMAIL_SMTP_HOST=...
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=...
EMAIL_SMTP_PASS=...
EMAIL_FROM=Bloomy <no-reply@bloomy.dev>
```
4. Deploy. Get backend URL: e.g. `https://bloomy-backend.onrender.com`.

### Stripe Webhook After Backend Live
- Add endpoint to Stripe Dashboard.
- Update webhook secret in Render env if it changed.
- Test with Stripe CLI locally (optional):
```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 9. Frontend Deployment (Vercel Example)
1. Import GitHub project.
2. Project root: `client/bloomy-project`.
3. Build command: `npm install && npm run build`.
4. Output directory: `dist`.
5. Environment Variables (Vercel):
```
VITE_API_URL=https://bloomy-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=...
```
6. Deploy; production domain e.g. `https://bloomy.vercel.app`.
7. Add this domain to `CLIENT_ORIGINS` in backend and redeploy backend if needed.

## 10. Local Development Flow
- Run MongoDB Atlas remotely (no change).
- Stripe CLI for webhooks while using localhost.
- Keep `.env` files locally:
  - `server/.env` for backend secrets.
  - `client/bloomy-project/.env` for `VITE_API_URL` & `VITE_GOOGLE_CLIENT_ID`.

## 11. Updating the App
- Push changes to `main` → triggers auto redeploy on platforms.
- If you add a new environment variable, set it in hosting dashboard before relying on it.
- Backend sleeps (Render free). First request can be slow (cold start). Optionally use an uptime ping (free services) to keep warm if allowed.

## 12. Handling Common Issues
| Issue | Cause | Fix |
|-------|-------|-----|
| CORS blocked | Origin not listed | Update `CLIENT_ORIGINS` env and redeploy backend |
| 401 on auth | Missing cookie in cross-origin | Ensure `withCredentials: true` and CORS `credentials: true` |
| Stripe webhook signature fail | Raw body lost | The webhook route already uses `express.raw` before `express.json`; keep order |
| Google login fails in prod | Origin mismatch | Add prod domain to Google OAuth origins |
| Gemini errors | API key missing or quota | Verify `GOOGLE_API_KEY` & usage limits |
| Email not sending | Provider credentials wrong | Recheck provider env vars or sandbox limitation |

## 13. Optional Hardening
- Add `helmet` and `express-rate-limit` to backend.
- Move chat rate limit state to Redis if scaling (for now in-memory is fine).
- Add logging (pino) and error tracking (Sentry free tier).

## 14. Minimal Extra Code Change for Multi-Origin
Already applied: `CLIENT_ORIGINS` supports comma-separated origins.

## 15. Deployment Checklist (Copy/Paste)
```
[ ] MongoDB Atlas cluster created & MONGO_URI saved
[ ] Stripe product + price + keys + webhook configured
[ ] Google OAuth client configured with prod origin
[ ] Gemini API key created
[ ] Email provider credentials added
[ ] Backend deployed (Render) with all env vars (Option A or B)
[ ] Frontend deployed (Render Static OR served via Express) with VITE_API_URL & GOOGLE_CLIENT_ID
[ ] CLIENT_ORIGINS updated to include prod frontend domain (or same domain if single service)
[ ] Stripe webhook secret added after first deployment
[ ] Tested login, premium page, AI chat, PDF export in prod
```

## 16. Future Improvements (Still Free)
- Cache AI responses via local storage to reduce calls.
- Add progressive web app (PWA) manifest to frontend.
- Use Resend for transactional emails (domain verification optional).

## 17. Rollback Strategy
If a deploy breaks:
- On hosting dashboard, redeploy previous successful build (Render keeps history / Vercel has Deployments tab).
- Use Git tags for stable releases (`v0.1.0`).

## 18. Environment Variable Summary
Backend:
```
MONGO_URI
CLIENT_ORIGINS
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
GOOGLE_API_KEY
GOOGLE_MODEL
GOOGLE_CLIENT_ID
JWT_SECRET
EMAIL_SMTP_HOST
EMAIL_SMTP_PORT
EMAIL_SMTP_USER
EMAIL_SMTP_PASS
EMAIL_FROM
```
Frontend:
```
VITE_API_URL
VITE_GOOGLE_CLIENT_ID
```
(Anything else used in client must start with VITE_ to be exposed.)

---
This gives you a reproducible, fully free deployment path. Ask if you want a consolidated shell script or CI workflow sample.
