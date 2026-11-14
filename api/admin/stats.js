import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

async function safeCount(query) {
  try {
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const [
    total_notices,
    active_notices,
    total_faculty,
    total_gallery,
    total_inquiries,
    new_inquiries_today
  ] = await Promise.all([
    safeCount(supabase.from('notices').select('*', { count: 'exact', head: true })),
    safeCount(supabase.from('notices').select('*', { count: 'exact', head: true }).eq('is_active', true)),
    safeCount(supabase.from('faculty').select('*', { count: 'exact', head: true }).eq('is_active', true)),
    safeCount(supabase.from('gallery_items').select('*', { count: 'exact', head: true })),
    safeCount(supabase.from('feedback').select('*', { count: 'exact', head: true })),
    safeCount(supabase.from('feedback').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00.000Z`).lt('created_at', `${today}T23:59:59.999Z`))
  ]);

  return res.status(200).json({
    total_notices,
    active_notices,
    total_faculty,
    total_gallery,
    total_inquiries,
    new_inquiries_today
  });
}
