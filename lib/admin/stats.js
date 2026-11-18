import { supabase, isSupabaseConfigured } from '../supabase.js';

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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
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

  let total_students = 694;
  let total_alumni = 0;
  try {
    const { data: pRecord } = await supabase
      .from('school_profiles')
      .select('values')
      .eq('profile_key', 'tgms_profile_tgms-somaram')
      .maybeSingle();

    if (pRecord && pRecord.values) {
      let val = pRecord.values;
      if (typeof val === 'string') {
        try { val = JSON.parse(val); } catch {}
      }
      if (val.strength && Array.isArray(val.strength.groups)) {
        let sum = 0;
        val.strength.groups.forEach(g => {
          (g.rows || []).forEach(r => {
            sum += (Number(r[1]) || 0) + (Number(r[2]) || 0);
          });
        });
        if (sum > 0) total_students = sum;
      }
      if (Array.isArray(val.alumni)) total_alumni = val.alumni.length;
    }
  } catch {}

  return res.status(200).json({
    total_notices,
    active_notices,
    total_faculty,
    total_gallery,
    total_inquiries,
    new_inquiries_today,
    total_students,
    total_alumni
  });
}
