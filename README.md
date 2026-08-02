# ShopHub — E-Commerce Frontend

A full-featured e-commerce frontend built with React + Vite, connected to a live REST API backend. Deployed on Railway.

🔗 **Live Demo:** `https://ecommerce-frontend-production-8d98.up.railway.app`

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **State Management:** Context API + useReducer
- **HTTP Client:** Axios (with interceptors)
- **Animations:** Framer Motion
- **Notifications:** React Toastify
- **Deployment:** Railway

---

## Features

- OTP-based registration & email verification
- JWT login / logout with persistent session
- Forgot password & reset via OTP email
- Product listing with search, filters (category, price, rating), sorting & pagination
- Amazon-style homepage with hero slider, category grids, deals banner
- Product details page with image, reviews, similar products
- Wishlist (add/remove)
- Cart (add, update quantity, remove, clear) — synced with backend
- Coupon code validation (`SAVE10`, `SAVE20`, `FLAT50`)
- Checkout with billing form & Razorpay payment
- Order history & order tracking
- AI chatbot powered by Gemini
- Dark mode toggle
- Admin dashboard — manage products, orders, users
- Fully responsive

---

## Project Structure

```
src/
├── components/
│   ├── homepage/
│   │   ├── AmazonGrid.jsx
│   │   ├── HeroSlider.jsx
│   │   ├── DealOfTheDay.jsx
│   │   ├── ProductCarousel.jsx
│   │   └── CategoryGrid.jsx
│   ├── ProductCard.jsx
│   ├── ProductSkeleton.jsx
│   ├── ProductReviews.jsx
│   ├── ReviewSummary.jsx
│   ├── SimilarProducts.jsx
│   ├── CartItem.jsx
│   ├── CheckoutForm.jsx
│   ├── CouponInput.jsx
│   ├── Filters.jsx
│   ├── SearchBar.jsx
│   ├── AutocompleteSearch.jsx
│   ├── Chatbot.jsx
│   ├── OrderTracker.jsx
│   ├── WishlistButton.jsx
│   ├── NotifyMe.jsx
│   ├── DarkModeToggle.jsx
│   ├── ErrorBoundary.jsx
│   └── Toast.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── WishlistContext.jsx
│   ├── ThemeContext.jsx
│   ├── useCart.js
│   └── useAuth.js
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductDetails.jsx
│   ├── ProductListingPage.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderHistory.jsx
│   ├── Profile.jsx
│   ├── Wishlist.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminOrders.jsx
│   └── AdminUsers.jsx
├── utils/
│   ├── api.js              # Axios instance with auth interceptor
│   ├── cartReducer.js
│   ├── imageUtils.js
│   └── couponLogic.js
├── App.jsx
└── main.jsx
```

---

## Environment Variables

```env
VITE_API_URL=https://ecommerce-backend-production-bb31.up.railway.app/api
```

> All env vars must be prefixed with `VITE_` to be exposed to the browser by Vite.

---

## Local Setup

```bash
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev    # starts on http://localhost:5173
```

---

## Build & Deploy

```bash
npm run build       # outputs to dist/
npx serve -s dist   # preview production build locally
```

Railway build command: `npm install && npm run build`
Railway start command: `npx serve -s dist -l 3000`

---

## Available Coupon Codes

| Code | Discount |
|---|---|
| `SAVE10` | 10% off |
| `SAVE20` | 20% off |
| `FLAT50` | ₹50 flat off |

---

## Pages Overview

| Page | Route |
|---|---|
| Home | `/` |
| Login | `/login` |
| Register | `/register` |
| Product Details | `/product/:id` |
| Product Listing | `/products` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order History | `/orders` |
| Profile | `/profile` |
| Wishlist | `/wishlist` |
| Admin Dashboard | `/admin` |
| Admin Products | `/admin/products` |
| Admin Orders | `/admin/orders` |
| Admin Users | `/admin/users` |

---

## License

ISC
