import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from './config/config.js';


const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    config.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        const normalizedOrigin = origin.replace(/\/$/, "");
        const isAllowed = allowedOrigins.some(allowed => 
            allowed.replace(/\/$/, "") === normalizedOrigin
        );

        if (isAllowed) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true
}));



// google auth 
app.use(passport.initialize());

passport.use(new GoogleStrategy({
   clientID: config.GOOGLE_CLIENT_ID,
   clientSecret: config.GOOGLE_CLIENT_SECRET,
   callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
   return done(null, profile);
}));



// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


export default app;
