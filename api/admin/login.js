import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'tgmssomaram.knr@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';

  // 1. Direct environment variable check (with fallback default)
  if (email.toLowerCase().trim() === adminEmail.toLowerCase().trim() && password === adminPassword) {
    res.setHeader('Set-Cookie', 'tgms_admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
    return res.status(200).json({
      success: true,
      user: { email: adminEmail, role: 'superadmin' }
    });
  }

  // 2. Supabase database check
  if (isSupabaseConfigured()) {
    try {
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (user && user.password_hash === password) {
        res.setHeader('Set-Cookie', 'tgms_admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
        return res.status(200).json({
          success: true,
          user: { email: user.email, role: user.role }
        });
      }
    } catch (e) {
      console.error('Supabase admin login error:', e);
    }
  }

  return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
}
