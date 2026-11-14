import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Fetch existing record
    const { data: existing, error: fetchError } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    if (existing) {
      // Deep merge: merge top-level keys from body into existing values
      const mergedValues = { ...(existing.values || {}), ...body };
      const { data, error } = await supabase
        .from('school_profiles')
        .update({
          values: mergedValues,
          revision: (existing.revision || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('profile_key', PROFILE_KEY)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    } else {
      // Insert new profile record
      const { data, error } = await supabase
        .from('school_profiles')
        .insert([{
          id: PROFILE_KEY,
          profile_key: PROFILE_KEY,
          values: body,
          revision: 1,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ data });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
