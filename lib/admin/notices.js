import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

async function syncNoticesToSchoolProfile() {
  if (!isSupabaseConfigured()) return;
  try {
    const { data: items } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!items) return;

    const { data: profileRecord } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();

    let values = profileRecord?.values || {};
    if (typeof values === 'string') {
      try { values = JSON.parse(values); } catch {}
    }

    const formattedNotices = items.map(n => ({
      id: n.id,
      title: n.title,
      detail: n.detail || n.title,
      date: n.date || new Date().toISOString().slice(0, 10)
    }));

    values.notices = formattedNotices;
    values.flashNews = formattedNotices;

    await supabase
      .from('school_profiles')
      .upsert({
        id: PROFILE_KEY,
        profile_key: PROFILE_KEY,
        values: values,
        revision: (profileRecord?.revision || 1) + 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_key' });

    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        local.notices = formattedNotices;
        local.flashNews = formattedNotices;
        fs.writeFileSync(p, JSON.stringify(local, null, 2));
      }
    } catch {}
  } catch (err) {
    console.warn('Sync notices to profile notice:', err.message);
  }
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
    const all = req.query.all === 'true';
    let query = supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (!all) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { title, detail, date, is_active } = body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const { data, error } = await supabase
      .from('notices')
      .insert([{ title, detail, date, is_active: is_active !== undefined ? is_active : true }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    await syncNoticesToSchoolProfile();
    return res.status(201).json({ data });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { id, title, detail, date, is_active } = body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (detail !== undefined) updates.detail = detail;
    if (date !== undefined) updates.date = date;
    if (is_active !== undefined) updates.is_active = is_active;
    const { data, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    await syncNoticesToSchoolProfile();
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = body.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    await syncNoticesToSchoolProfile();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
