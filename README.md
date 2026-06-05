<h1 align="center">
  <br>
  MERN E-COMMERCE PLATFORM 🛍️
  <br>
</h1>

<p align="center">
A full-featured e-commerce platform with web and mobile apps, including product management, cart, orders, checkout, promotions, and an admin dashboard.
</p>

<div align="center">
  <img src="./client/public/banner.png" alt="Banner" width="900">
</div>

---

## 🔋 Features

### 🛒 Customer Features

- 🔐 **Authentication** – Secure sign up and sign in powered by Clerk.
- 🏠 **Modern Homepage** – Dynamic banners, featured products, and promotional sections.
- 📦 **Product Catalog** – Browse products with category-based filtering.
- 🔍 **Product Details** – Detailed product information, pricing, and images.
- ❤️ **Wishlist Management** – Save favorite products for later.
- 🛒 **Shopping Cart** – Add, update, and remove products from cart.
- 🎟️ **Promo Codes** – Apply discount coupons during checkout.
- 📍 **Address Management** – Add and manage multiple delivery addresses.
- 💳 **Checkout Flow** – Seamless order placement process.
- 📦 **Order Tracking** – View current and past orders.
- 🔁 **Order Returns** – Request returns directly from the orders page.
- 👤 **Profile Management** – Manage account information and preferences.

### 👨‍💼 Admin Features

- 📊 **Dashboard Analytics** – Overview of orders, products, and store performance.
- 📦 **Product Management** – Create, update, and delete products.
- 🏷️ **Category Management** – Organize products into categories.
- 🎟️ **Promo Code Management** – Create and manage discount campaigns.
- 📬 **Order Management** – Process and update customer orders.
- 🖼️ **Homepage Banner Management** – Control promotional content.
- ⚙️ **Store Settings** – Configure store-wide preferences and options.

### 📱 Mobile App Features

- 📲 **React Native Expo Application** – Native mobile experience for Android and iOS.
- 🔄 **Shared Backend APIs** – Uses the same backend as the web application.
- 🔐 **Clerk Authentication** – Unified authentication across web and mobile.
- 🛒 **Mobile Shopping Experience** – Browse, wishlist, cart, checkout, and orders.
- 📦 **Real-Time Data Sync** – Products, orders, and user data synced across platforms.

---

## ⚙️ Tech Stack & Architecture

### Frontend (Web)

- **React 19** – Modern UI development.
- **TypeScript** – Type-safe development.
- **Vite** – Fast build tooling.
- **Tailwind CSS** – Utility-first styling.
- **React Router** – Client-side routing.
- **Zustand / Context API** – State management.

### Mobile Application

- **React Native**
- **Expo**
- **NativeWind**
- **Expo Router**
- **Shared API Layer**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **REST API Architecture**

---

## 🤸 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB Database
- Clerk Account
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/soumadip-dev/Sylora.git

   cd Sylora
   ```

2. Install dependencies:

   ```bash
   # Backend
   cd server
   bun install

   # Frontend
   cd ../client
   bun install

   # Mobile App
   cd ../mobile
   bun install
   ```

3. Configure environment variables:

   Backend `.env`

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri

   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   CLIENT_URL=http://localhost:5173
   ```

   Frontend `.env`

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   ```

   Mobile `.env`

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the backend server:

   ```bash
   cd server
   bun run dev
   ```

5. Start the web application:

   ```bash
   cd client
   bun run dev
   ```

6. Start the mobile application:

   ```bash
   cd mobile
   bunx expo start
   ```

---

## 📂 Project Structure

```bash
mern-commerce-platform/
│
├── client/             # React Web Application
├── mobile/             # React Native Expo App
├── server/             # Node.js & Express Backend
│
├── .gitignore
└── README.md
```

---
