import { supabase, isSupabaseConfigured } from '../supabase.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { current_password, new_password, confirm_password } = body;

  if (!current_password || !new_password || !confirm_password) {
    return res.status(400).json({ error: 'All password fields are required' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && current_password !== adminPassword) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Try updating admin_users table in Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'tgmssomaram.knr@gmail.com';
      await supabase
        .from('admin_users')
        .update({ password_hash: new_password })
        .eq('email', adminEmail);
    } catch (e) {
      console.error('Failed to update admin_users table:', e);
    }
  }

  const hint = `${new_password.substring(0, 2)}${'*'.repeat(new_password.length - 2)}`;

  return res.status(200).json({
    success: true,
    requiresEnvUpdate: true,
    message: 'Password verified. To apply the new password, update ADMIN_PASSWORD in your Vercel environment variables dashboard and redeploy.',
    newPasswordHint: `Your new password is: ${hint}`
  });
}
