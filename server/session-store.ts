import session from 'express-session';
import MongoStore from 'connect-mongo';

export function getSessionStore() {
  const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/eztaxmate';
  
  return MongoStore.create({
    mongoUrl,
    touchAfter: 24 * 3600, // lazy session update
    ttl: 7 * 24 * 60 * 60 // 7 days
  });
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: getSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}