import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from './config/config.js';
import productRoutes from './routes/product.routes.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.NODE_ENV === "development" ? "http://localhost:5173" : "",
    credentials: true
}));



// google auth 
app.use(passport.initialize());

passport.use(new GoogleStrategy({
   clientID: config.GOOGLE_CLIENT_ID,
   clientSecret: config.GOOGLE_CLIENT_SECRET,
   callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
   return done(null, profile);
}));



// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


export default app;
