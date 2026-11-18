import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

async function getAlumniList() {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('school_profiles')
        .select('values')
        .eq('profile_key', PROFILE_KEY)
        .maybeSingle();

      if (data && data.values) {
        let val = data.values;
        if (typeof val === 'string') {
          try { val = JSON.parse(val); } catch {}
        }
        if (Array.isArray(val.alumni)) return val.alumni;
      }
    } catch (e) {}
  }

  try {
    const p = path.join(process.cwd(), 'data', 'school-data.json');
    if (fs.existsSync(p)) {
      const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
      if (Array.isArray(local.alumni)) return local.alumni;
    }
  } catch {}

  return [];
}

async function saveAlumniList(alumniList) {
  if (isSupabaseConfigured()) {
    const { data: existing } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();

    let currentValues = existing?.values || {};
    if (typeof currentValues === 'string') {
      try { currentValues = JSON.parse(currentValues); } catch {}
    }

    currentValues.alumni = alumniList;
    const nextRevision = (existing?.revision || 1) + 1;

    await supabase
      .from('school_profiles')
      .upsert({
        id: PROFILE_KEY,
        profile_key: PROFILE_KEY,
        values: currentValues,
        revision: nextRevision,
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_key' });
  }

  try {
    const p = path.join(process.cwd(), 'data', 'school-data.json');
    if (fs.existsSync(p)) {
      const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
      local.alumni = alumniList;
      fs.writeFileSync(p, JSON.stringify(local, null, 2), 'utf-8');
    }
  } catch (e) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  // GET: Fetch alumni list
  if (req.method === 'GET') {
    const list = await getAlumniList();
    return res.status(200).json({ data: list });
  }

  // POST: Add new alumni entry
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, batch, achievement, photo, approved } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Alumni name is required' });
    }

    const currentList = await getAlumniList();
    const newEntry = {
      id: body.id || crypto.randomUUID(),
      name: name.trim(),
      batch: (batch || '').trim(),
      achievement: (achievement || '').trim(),
      photo: photo || null,
      approved: approved !== undefined ? Boolean(approved) : true,
      created_at: new Date().toISOString()
    };

    currentList.unshift(newEntry);
    await saveAlumniList(currentList);

    return res.status(201).json({ success: true, data: newEntry });
  }

  // PUT: Update existing alumni entry
  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { id, ...fields } = body;

    if (!id) return res.status(400).json({ error: 'Alumni id is required' });

    const currentList = await getAlumniList();
    const idx = currentList.findIndex(a => a.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Alumni entry not found' });
    }

    currentList[idx] = {
      ...currentList[idx],
      ...fields,
      id: id,
      updated_at: new Date().toISOString()
    };

    await saveAlumniList(currentList);
    return res.status(200).json({ success: true, data: currentList[idx] });
  }

  // DELETE: Remove alumni entry
  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = body.id || req.query.id;

    if (!id) return res.status(400).json({ error: 'Alumni id is required' });

    const currentList = await getAlumniList();
    const filtered = currentList.filter(a => a.id !== id);

    await saveAlumniList(filtered);
    return res.status(200).json({ success: true, message: 'Alumni entry deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
