# 🛒 GoGro – Grocery Delivery App

A modern, responsive grocery delivery front-end built with **React**, **Tailwind CSS**, and **Context API**. Works fully offline using localStorage.

## Features
- 🛍️ Browse 20 grocery items across 6 categories (Fruits, Vegetables, Dairy, Bakery, Beverages, Snacks)
- 🔍 Search & filter by name and category
- 🛒 Add to cart with quantity management
- 📝 Checkout with form validation & simulated payment (COD / Online)
- 👤 User authentication (Register, Login, Admin demo mode)
- 📦 Order tracking with status badges (Placed → Packed → Delivered)
- 🛠️ Admin dashboard to manage products, inventory & orders
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🍌 Emoji-based product visuals — no broken images

## Tech Stack
| Area | Technology |
|------|------------|
| Framework | React (Hooks, Context API, useReducer) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Persistence | localStorage |
| Icons | react-icons |

## How to Run
 bash
npm install
npm start
 
App opens at `http://localhost:3000`

## Build for Production
bash
npm run build


## Demo Access
| Role | Email | How to login |
|------|-------|-------------|
| Admin | admin@gogro.com | Click **Login as Admin** on login page (any password) |
| User | Register a new account | Fill name, email, password |

## Project Structure
 
src/
├── components/     # Header, Footer, ProductCard, CartItem, etc.
├── contexts/       # AuthContext, CartContext, ProductContext, OrderContext
├── data/           # products.js, categories.js (mock data)
├── pages/          # All route pages + admin/
├── App.js          # Routing & providers
└── index.js        # Entry point
 



## Course Outcomes Covered
| CO | Description |
|----|------------|
| CO1 | Web Development Fundamentals |
| CO2 | Build web pages & applications |
| CO3 | Front-end frameworks & optimization |
| CO4 | Security best practices & testing |
| CO5 | Project development skills |

---

Built with ❤️ for the Frontend Development course.

