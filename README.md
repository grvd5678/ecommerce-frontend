# E-Commerce Frontend

A fully functional e-commerce frontend built with React, featuring product filtering, cart management, and checkout functionality.

## Features

- **Product Listing** with filters (price, category, rating)
- **Sorting** (low to high, high to low, rating)
- **Cart System** (add/remove/update quantity)
- **Persistent Cart** using localStorage
- **Coupon Logic** (10%, 20% discount, flat $50 off)
- **Checkout Page** with form validation

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **State Management:** Context API + useReducer
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form
- **Persistence:** localStorage

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Available Coupons

- `SAVE10` - 10% discount
- `SAVE20` - 20% discount
- `FLAT50` - $50 flat discount

## Project Structure

```
src/
 ├── components/
 │     ├── ProductCard.jsx
 │     ├── Filters.jsx
 │     ├── CartItem.jsx
 │     ├── CouponInput.jsx
 │     ├── CheckoutForm.jsx
 │
 ├── context/
 │     ├── CartContext.jsx
 │
 ├── pages/
 │     ├── Home.jsx
 │     ├── Cart.jsx
 │     ├── Checkout.jsx
 │
 ├── data/
 │     ├── products.json
 │
 ├── utils/
 │     ├── filterLogic.js
 │     ├── cartReducer.js
 │     ├── couponLogic.js
 │
 ├── App.jsx
 ├── main.jsx
```

## Deployment

Deploy to Vercel or Netlify:

```bash
npm run build
```
