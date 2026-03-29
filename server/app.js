const express = require('express');
const cors    = require('cors');

const authRoutes   = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const postsRoutes  = require('./routes/posts.routes');
const adminRoutes  = require('./routes/admin.routes');
const tripsRoutes  = require('./routes/trips.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for secure cookies/headers behind Render/Vercel load balancers
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Request logging to help debug auth
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});


// Routes → Controllers → Models (MVC flow)
app.use('/auth',   authRoutes);
app.use('/upload', uploadRoutes);
app.use('/posts',  postsRoutes);
app.use('/admin',  adminRoutes);
app.use('/trips',  tripsRoutes);

app.use(errorHandler);

module.exports = app;
