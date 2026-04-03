import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as jose from 'jose';
import crypto from 'crypto';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Database initialization
let db;
(async () => {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      data TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS security (
      ip TEXT PRIMARY KEY,
      attempts INTEGER DEFAULT 0,
      last_attempt INTEGER
    )
  `);
  console.log('Connected to SQLite database.');
})();

// JWT Configuration
const JWT_SECRET = 'your-secret-key-should-be-more-secure-in-production';
const secretKey = crypto.createHash('sha256').update(JWT_SECRET).digest();

// Helper to check if setup is done
const isSetup = async () => {
  const result = await db.get('SELECT value FROM settings WHERE key = ?', 'admin_password_hash');
  return !!result;
};

// Endpoints
app.get('/api/status', async (req, res) => {
  try {
    const setup = await isSetup();
    res.json({ setup });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/setup', async (req, res) => {
  const { passwordHash } = req.body;
  if (!passwordHash) return res.status(400).json({ error: 'Missing password hash' });

  try {
    if (await isSetup()) return res.status(400).json({ error: 'Setup already completed' });
    
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', 'admin_password_hash', passwordHash);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

app.post('/api/login', async (req, res) => {
  const { passwordHash, identifier, deviceFingerprint } = req.body;
  const ip = req.ip;
  const now = Date.now();
  
  try {
    // Basic rate limit check
    const sec = await db.get('SELECT attempts, last_attempt FROM security WHERE ip = ?', ip);
    if (sec && sec.attempts >= 5 && (now - sec.last_attempt) < 15 * 60 * 1000) {
      const waitTime = Math.ceil((15 * 60 * 1000 - (now - sec.last_attempt)) / 60000);
      return res.status(429).json({ error: `Acesso bloqueado por segurança. Tente novamente em ${waitTime} minuto(s).` });
    }

    const stored = await db.get('SELECT value FROM settings WHERE key = ?', 'admin_password_hash');
    if (!stored) return res.status(400).json({ error: 'Setup not completed' });

    if (passwordHash === stored.value) {
      // Generate JWT
      const jwt = await new jose.SignJWT({ role: 'admin', identifier, deviceFingerprint })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('imoveis:admin')
        .setExpirationTime('15m') // Shortened session
        .sign(secretKey);
        
      // Reset attempts on success
      await db.run('DELETE FROM security WHERE ip = ?', req.ip);
        
      res.json({ success: true, token: jwt });
    } else {
      // Logic for rate limiting
      const now = Date.now();
      const ip = req.ip;
      const sec = await db.get('SELECT attempts FROM security WHERE ip = ?', ip);
      const attempts = (sec?.attempts || 0) + 1;
      
      if (sec) {
        await db.run('UPDATE security SET attempts = ?, last_attempt = ? WHERE ip = ?', attempts, now, ip);
      } else {
        await db.run('INSERT INTO security (ip, attempts, last_attempt) VALUES (?, ?, ?)', ip, attempts, now);
      }

      res.status(401).json({ 
        error: 'Senha incorreta', 
        attemptsLeft: Math.max(0, 5 - attempts) 
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
});

app.post('/api/verify', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: 'imoveis:admin',
    });
    res.json({ valid: true, payload });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Sessão expirada' });
  }
});

app.post('/api/change-password', async (req, res) => {
  const { currentPasswordHash, newPasswordHash, token } = req.body;

  try {
    // Basic JWT verification (simplified for this task)
    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: 'imoveis:admin',
    });

    const stored = await db.get('SELECT value FROM settings WHERE key = ?', 'admin_password_hash');
    if (currentPasswordHash !== stored.value) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    await db.run('UPDATE settings SET value = ? WHERE key = ?', newPasswordHash, 'admin_password_hash');
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
});

// Property Management Endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const rows = await db.all('SELECT data FROM properties');
    const properties = rows.map(row => JSON.parse(row.data));
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/properties', async (req, res) => {
  const { properties } = req.body; // Array of properties
  
  if (!Array.isArray(properties)) {
    return res.status(400).json({ error: 'Invalid properties data' });
  }

  try {
    // Basic sync: delete all and re-insert (simple for current scale)
    await db.run('DELETE FROM properties');
    const stmt = await db.prepare('INSERT INTO properties (id, data) VALUES (?, ?)');
    
    for (const prop of properties) {
      await stmt.run(String(prop.id), JSON.stringify(prop));
    }
    await stmt.finalize();
    
    res.json({ success: true, count: properties.length });
  } catch (error) {
    console.error('Save properties error:', error);
    res.status(500).json({ error: 'Failed to save properties' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
