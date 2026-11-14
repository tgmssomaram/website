import { supabase, isSupabaseConfigured } from '../supabase.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('order_index', { ascending: true })
      .order('is_active', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, designation, subject, qualification, photo_url, order_index, is_active } = body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const { data, error } = await supabase
      .from('faculty')
      .insert([{ name, designation, subject, qualification, photo_url, order_index: order_index || 0, is_active: is_active !== undefined ? is_active : true }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { id, ...fields } = body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const updates = {};
    const allowed = ['name', 'designation', 'subject', 'qualification', 'photo_url', 'order_index', 'is_active'];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }
    const { data, error } = await supabase
      .from('faculty')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = body.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
