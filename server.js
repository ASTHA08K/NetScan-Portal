require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database Connection ──
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database!');
    release();
  }
});

app.use(cors());
app.use(express.json());

// ── AUTH MIDDLEWARE ──
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── LOGIN ──
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, username, role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ── GET all scans from database ──
app.get('/api/scans', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scans ORDER BY scan_date DESC'
    );
    // Get ports for each scan
    const scans = await Promise.all(result.rows.map(async (scan) => {
      const ports = await pool.query(
        'SELECT * FROM port_results WHERE scan_id = $1',
        [scan.id]
      );
      return { ...scan, ports: ports.rows };
    }));
    res.json(scans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ── GET single scan ──
app.get('/api/scans/:id', async (req, res) => {
  try {
    const scan = await pool.query(
      'SELECT * FROM scans WHERE id = $1',
      [req.params.id]
    );
    if (scan.rows.length === 0)
      return res.status(404).json({ error: 'Scan not found' });

    const ports = await pool.query(
      'SELECT * FROM port_results WHERE scan_id = $1',
      [req.params.id]
    );
    res.json({ ...scan.rows[0], ports: ports.rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ── RUN a new scan ──
app.post('/api/scan', async (req, res) => {
  const { target } = req.body;
  if (!target)
    return res.status(400).json({ error: 'Target IP is required' });

  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(target))
    return res.status(400).json({ error: 'Invalid IP address' });

  console.log(`🔍 Scanning: ${target}`);

  exec(`nmap -sV ${target}`, async (error, stdout) => {
    if (error) {
      console.error('Nmap error:', error);
      return res.status(500).json({ error: 'Scan failed. Is Nmap installed?' });
    }

    // Parse nmap output
    const ports = [];
    stdout.split('\n').forEach(line => {
      const match = line.match(/^(\d+)\/(tcp|udp)\s+(\w+)\s+(\S+)\s*(.*)?$/);
      if (match) {
        ports.push({
          port:     parseInt(match[1]),
          protocol: match[2],
          state:    match[3],
          service:  match[4],
          version:  match[5] ? match[5].trim() : 'unknown'
        });
      }
    });

    const openPorts = ports.filter(p => p.state === 'open').length;

    try {
      // Save scan to database
      const scanResult = await pool.query(
        `INSERT INTO scans (target, total_ports, vulnerabilities_found)
         VALUES ($1, $2, $3) RETURNING *`,
        [target, ports.length, openPorts]
      );
      const scan = scanResult.rows[0];

      // Save each port to database
      for (const p of ports) {
        await pool.query(
          `INSERT INTO port_results (scan_id, port, service, version, state)
           VALUES ($1, $2, $3, $4, $5)`,
          [scan.id, p.port, p.service, p.version, p.state]
        );
      }

      console.log(`✅ Scan saved to database! ID: ${scan.id}`);
      res.json({ ...scan, ports });

    } catch (dbErr) {
      console.error('DB save error:', dbErr);
      res.status(500).json({ error: 'Failed to save scan to database' });
    }
  });
});

// ── DELETE a scan ──
app.delete('/api/scans/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM port_results WHERE scan_id = $1',
      [req.params.id]
    );
    await pool.query(
      'DELETE FROM scans WHERE id = $1',
      [req.params.id]
    );
    res.json({ message: 'Scan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ── GET dashboard stats ──
app.get('/api/stats', async (req, res) => {
  try {
    const totalScans   = await pool.query('SELECT COUNT(*) FROM scans');
    const totalPorts   = await pool.query('SELECT SUM(total_ports) FROM scans');
    const totalVulns   = await pool.query('SELECT SUM(vulnerabilities_found) FROM scans');
    const recentScans  = await pool.query('SELECT * FROM scans ORDER BY scan_date DESC LIMIT 5');

    res.json({
      totalScans:  parseInt(totalScans.rows[0].count),
      totalPorts:  parseInt(totalPorts.rows[0].sum) || 0,
      totalVulns:  parseInt(totalVulns.rows[0].sum) || 0,
      recentScans: recentScans.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ NetScan server running at http://localhost:${PORT}`);
  console.log(`📡 Connected to PostgreSQL — netscan_db`);
});