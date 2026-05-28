require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDb } = require('./lib/db');

const authRoutes    = require('./routes/auth');
const agentRoutes   = require('./routes/agent');
const projectRoutes = require('./routes/projects');
const pdfRoutes     = require('./routes/pdf');
const publicRoutes  = require('./routes/public');

const app  = express();
const PORT = process.env.PORT || process.env.AGENT_PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// CORS — only needed in development (frontend and backend are same origin in production)
if (!isProd) {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json({ limit: '2mb' }));

// API routes
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'issatrix-agent-api' })
);
app.use('/api/auth',    authRoutes);
app.use('/api/agent',   agentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pdf',     pdfRoutes);
app.use('/api/public',  publicRoutes);

// Serve built Vite frontend in production
const DIST = path.join(__dirname, '../dist');
if (isProd && fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

initDb();

app.listen(PORT, () => {
  console.log(`\n  Issatrix  →  http://localhost:${PORT}  [${isProd ? 'production' : 'development'}]\n`);
});
