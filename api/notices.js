import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data) return res.status(200).json({ notices: data });
      } catch (e) {}
    }
    return res.status(200).json({ notices: [] });
  }

  if (req.method === 'POST') {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { data, error } = await supabase
      .from('notices')
      .insert([{
        title: body.title,
        detail: body.detail || body.title,
        date: body.date || new Date().toISOString().slice(0, 10),
        is_active: true
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ notice: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
