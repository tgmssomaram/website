import { supabase, isSupabaseConfigured } from './lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          request_id: body.requestId,
          name: body.name,
          role: body.role,
          contact: body.contact,
          message: body.message,
          website: body.website
        }]);

      if (error) throw error;
      return res.status(200).json({ ok: true, message: 'Inquiry received successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Database error' });
    }
  }

  // Graceful fallback if database is not connected yet
  return res.status(200).json({ ok: true, message: 'Received (offline preview)' });
}
