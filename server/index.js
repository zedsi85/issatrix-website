require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const { initDb } = require('./lib/db');

const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agent');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.AGENT_PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'issatrix-agent-api' })
);

app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/projects', projectRoutes);

initDb();

app.listen(PORT, () => {
  console.log(`\n  Issatrix Agent API  →  http://localhost:${PORT}\n`);
});
