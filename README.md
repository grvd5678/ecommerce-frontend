# ShopHub — E-Commerce Frontend

A modern, production-grade e-commerce single page application (SPA) built with React 18, Vite 7, Tailwind CSS, Framer Motion, and Recharts. Connected to a live Node.js/Express REST API backend and deployed live on Render.

[![Frontend CI](https://github.com/grvd5678/ecommerce-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/grvd5678/ecommerce-frontend/actions)
[![React Version](https://img.shields.io/badge/react-18.x-blue.svg)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/vite-7.x-646CFF.svg)](https://vitejs.dev/)

🔗 **Live Storefront:** `https://ecommerce-frontend-l3zz.onrender.com`  
🔗 **Live API Backend:** `https://ecommerce-api-tio6.onrender.com/api`

---

## Tech Stack

- **Framework:** React 18 + Vite 7
- **Styling:** Tailwind CSS + Lucide React Icons
- **Data Visualization:** Recharts 2.x
- **Animations:** Framer Motion (page transitions, spring physics, layout shifts)
- **Routing:** React Router DOM v6
- **State Management:** React Context API + useReducer architecture
- **HTTP Client:** Axios (with automated auth & token interceptors)
- **Notifications:** React Toastify
- **DevOps:** Multi-stage Docker build with Nginx Alpine, GitHub Actions CI

---

## Key Features

### 🛍️ Storefront & User Flow
- **OTP-based Authentication:** Email registration & account verification via SendGrid OTP.
- **Persistent Session:** JWT authentication stored securely in localStorage with axios interceptor auto-injection.
- **Product Browsing:** Live search with debouncing, multi-filter drawer (category, price range, star ratings), sorting, and infinite scroll pagination.
- **Amazon-style & Bento Grids:** Hero carousel, category visual showcases, and dynamic responsive cards.
- **Product Details:** High-res image view, verified customer reviews, similar product recommendations, and back-in-stock alerts (`NotifyMe`).
- **Interactive Cart & Stepper:** Sliding cart drawer, spring-animated quantity steppers (`[-]` and `[+]`), item removal exit transitions, and empty state micro-interactions.
- **Discount Engine:** Promo code validation (`SAVE10`, `SAVE20`, `FLAT50`) with live subtotals, tax, and shipping calculations.
- **Dual Payment Gateways:** Seamless checkout with Stripe and Razorpay integrations.
- **Order Tracking:** Self-service order history with a 4-stage visual progress tracker (`OrderTracker`).
- **AI Customer Assistant:** Integrated Gemini conversational chatbot widget.
- **Dark Mode:** System and manual dark/light theme toggle.

### 📊 Executive Admin Dashboard
- **Recharts Visual Analytics:**
  - **KPI Cards:** Gross Revenue, Total Orders, Average Order Value (AOV), and Active Users.
  - **Revenue & Sales Area Chart:** Interactive gradient timeline tracking daily sales.
  - **Fulfillment Donut Chart:** Visual breakdown of `delivered`, `processing`, `pending`, `shipped`, and `cancelled` orders.
  - **Top 5 Best-Sellers Bar Chart:** Units sold and gross revenue per item.
  - **Category Inventory Distribution:** Departmental catalog breakdown.
  - **Time Range Selector:** Filter analytics by 7 Days, 30 Days, 90 Days, or All Time.
- **AI Product Description Generator:**
  - Integrated with **Google Gemini (`gemini-3.6-flash`)**.
  - One-click *"✨ Generate with AI"* button in the Add/Edit Product modal that crafts persuasive, SEO-friendly e-commerce product copy.
- **Catalog & User Management:** Product CRUD with live search, stock badges, and user role management.

---

## Project Structure

```
ecommerce-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions automated build workflow
├── src/
│   ├── components/
│   │   ├── homepage/
│   │   │   ├── AmazonGrid.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── DealOfTheDay.jsx
│   │   │   ├── ProductCarousel.jsx
│   │   │   └── CategoryGrid.jsx
│   │   ├── ProductCard.jsx     # Memoized product card with hover animations
│   │   ├── ProductSkeleton.jsx # Shimmer loading placeholder
│   │   ├── ProductReviews.jsx  # Customer reviews and star ratings
│   │   ├── CartItem.jsx        # Animated item row with stepper
│   │   ├── CheckoutForm.jsx    # Stripe & Razorpay billing form
│   │   ├── Chatbot.jsx         # Gemini AI floating chat assistant
│   │   ├── OrderTracker.jsx    # Visual fulfillment progress bar
│   │   ├── DarkModeToggle.jsx  # Theme switcher
│   │   └── Toast.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # User state & JWT management
│   │   ├── CartContext.jsx     # Cart operations & price calculation
│   │   ├── WishlistContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── Home.jsx            # Storefront homepage
│   │   ├── ProductDetails.jsx  # Detailed product view
│   │   ├── Cart.jsx            # Full cart page
│   │   ├── Checkout.jsx        # Payment & shipping step
│   │   ├── OrderHistory.jsx    # Customer order log
│   │   ├── AdminDashboard.jsx  # Recharts BI analytics dashboard
│   │   ├── AdminProducts.jsx   # Product CRUD with AI copy generator
│   │   ├── AdminOrders.jsx     # Fulfillment status updates
│   │   └── AdminUsers.jsx      # Customer role management
│   ├── utils/
│   │   ├── api.js              # Axios instance with interceptors
│   │   └── cartReducer.js
│   ├── App.jsx
│   └── main.jsx
├── .dockerignore
├── Dockerfile                  # Multi-stage build + Nginx Alpine
├── nginx.conf                  # SPA fallback routing
├── vercel.json                 # Vercel SPA rewrites
└── package.json
```

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional, defaults to localhost:5000/api)
cp .env.example .env

# 3. Start development server
npm run dev
```

The app will start at `http://localhost:5173`.

---

## Production Build & Verification

```bash
# Verify production compilation
npm run build

# Preview production build locally
npm run preview
```

---

## Docker Deployment

Build and serve via lightweight Nginx container:

```bash
docker build -t shophub-frontend .
docker run -d -p 80:80 shophub-frontend
```

---

## License

ISC
