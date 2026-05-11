# SNITCH | Premium E-commerce Experience

![Project Preview](https://img.shields.io/badge/Design-Editorial%20Noir-black?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deploys-Vercel%20%26%20Render-informational?style=for-the-badge)

**Snitch** is a high-end, full-stack e-commerce platform built with the MERN stack. Designed with a minimalist "Editorial Noir" aesthetic, it prioritizes visual excellence, smooth performance, and a premium shopping experience.

---

## 🖤 Design Philosophy: Editorial Noir

Snitch isn't just an e-store; it's a visual statement.
- **Minimalist Aesthetics**: Clean lines, high-contrast layouts, and premium typography (Inter/Outfit).
- **Glassmorphism**: Subtle translucent layers for a modern, tactile feel.
- **Micro-animations**: Fluid transitions powered by **Framer Motion**.
- **Visual Excellence**: Sharp corners, editorial whitespace, and curated color palettes.

---

## 🚀 Key Features

### 🔐 Advanced Authentication
- **Dual-Flow Auth**: Secure login/signup using **JWT** and **Google OAuth 2.0**.
- **Protected Routes**: Role-based access control for users and admins.

### 🛒 Seamless Shopping
- **Dynamic Cart**: Real-time cart management synced with Redux and MongoDB.
- **Optimized Checkout**: A streamlined checkout flow with integrated payment verification.

### 💳 Integrated Payments
- **Razorpay Integration**: Secure, industry-standard payment gateway for credit cards, UPI, and wallets.
- **Order Tracking**: Detailed order history and real-time status updates.

### 🖼️ High-Performance Media
- **ImageKit Integration**: Dynamic image optimization, resizing, and fast delivery via CDN.
- **Multer-based Uploads**: Reliable file handling for product management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Auth**: [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/)
- **Language**: TypeScript/JavaScript (via `tsx`)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Razorpay API Keys
- ImageKit Account
- Google Cloud Console Project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akhiofficial/Snitch.git
   cd Snitch
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Fill in your variables in .env
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Fill in your variables in .env.local
   npm install
   npm run dev
   ```

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default 3000) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key for token signing |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit Private Key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL Endpoint |

### Frontend (`/frontend/.env.local`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Production Backend URL (leave empty for dev) |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay Key |

---

## 📂 Project Structure

```text
Snitch/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Logic for routes
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   └── middleware/    # Auth & validation
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── app/           # Routes & Global Providers
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-based logic (Redux slices)
│   │   └── pages/         # View components
│   └── index.html         # Entry point
└── README.md
```

---

## 🌐 Deployment

- **Frontend**: Optimized for [Vercel](https://vercel.com).
- **Backend**: Optimized for [Render](https://render.com) or [Railway](https://railway.app).

---

Developed with ❤️ by [Akhilesh](https://github.com/Akhiofficial)
