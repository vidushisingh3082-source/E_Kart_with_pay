# MERN Shop

A full-stack e-commerce app: Node/Express/MongoDB backend + React/Vite/Tailwind frontend.

## Structure
```
mern-shop/
  server/   -> Express + MongoDB API
  client/   -> React + Vite storefront + admin panel
```

## 1. Backend setup
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env`:
- `MONGO_URI` — local MongoDB or a free MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — http://localhost:5173 (default, no change needed for local dev)
- `CLOUDINARY_*` — only needed if you want product/banner image uploads to work (free account at cloudinary.com)

```bash
npm run dev
```
Runs on http://localhost:5000

## 2. Frontend setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:5173

## 3. Create your first admin user
There's no signup flag for "admin" in the UI (by design, for security). To make a user an admin:
1. Register a normal account through the app.
2. Open MongoDB (Compass, Atlas UI, or `mongosh`) and find that user in the `users` collection.
3. Change their `role` field from `"user"` to `"admin"`.
4. Log out and log back in — you'll be redirected to `/admin/dashboard` instead of the shop.

## Notes
- Payment: customers choose Razorpay (UPI / Card / Netbanking) or Cash on Delivery at checkout. Razorpay orders are confirmed only after signature verification (or the webhook). Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` in `server/.env`. See `server/controllers/shop/order-controller.js`.
- Image uploads (`admin/products` and `admin/features`) require Cloudinary credentials in `server/.env`.
