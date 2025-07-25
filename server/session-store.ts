import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const PgSession = connectPgSimple(session);

export function getSessionStore() {
  return new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: false, // We'll handle this with Drizzle
  });
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionSecret = process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production';
  
  return session({
    secret: sessionSecret,
    store: getSessionStore(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: 'connect.sid',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
      path: '/',
      domain: process.env.NODE_ENV === 'development' ? undefined : undefined,
    },
  });
}