const express = require('express');
const cors    = require('cors');

const authRoutes   = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const postsRoutes  = require('./routes/posts.routes');
const adminRoutes  = require('./routes/admin.routes');
const tripsRoutes  = require('./routes/trips.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
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
