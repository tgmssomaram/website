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
    let query = supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { title, image_url, category, caption, is_active } = body;
    if (!image_url) return res.status(400).json({ error: 'image_url is required' });
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([{
        title,
        image_url,
        category: category || 'School Activities',
        caption,
        is_active: is_active !== undefined ? is_active : true
      }])
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
    const allowed = ['title', 'image_url', 'category', 'caption', 'is_active'];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }
    const { data, error } = await supabase
      .from('gallery_items')
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
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
