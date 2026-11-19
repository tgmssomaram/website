import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

export function normalizeFacultyCategory(category, designation) {
  if (category && ['teaching', 'guest', 'vocational', 'support'].includes(category)) {
    return category;
  }
  const des = String(designation || '').toUpperCase();
  if (des.includes('HBT') || des.includes('GUEST')) return 'guest';
  if (des.includes('VOCATIONAL') || des.includes('TRAINER')) return 'vocational';
  if (des.includes('SUPPORT') || des.includes('ATTENDER') || des.includes('WATCHMAN') || 
      des.includes('OFFICE') || des.includes('ASSISTANT') || des.includes('SWEEPER') || 
      des.includes('SCAVENGER') || des.includes('OPERATOR') || des.includes('RECORD') || 
      des.includes('PHYSICAL DIRECTOR') || des.includes('PD') || des.includes('STAFF')) {
    return 'support';
  }
  return 'teaching';
}

async function syncFacultyToSchoolProfile() {
  if (!isSupabaseConfigured()) return;
  try {
    const { data: facultyRows } = await supabase
      .from('faculty')
      .select('*')
      .order('order_index', { ascending: true });

    if (!facultyRows) return;

    const { data: profileRecord } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();

    let values = profileRecord?.values || {};
    if (typeof values === 'string') {
      try { values = JSON.parse(values); } catch {}
    }

    const rawActive = facultyRows.filter(f => f.is_active !== false);
    const seenFaculty = new Set();
    const activeFaculty = [];
    for (const f of rawActive) {
      const key = (f.name || f.id || '').trim().toLowerCase();
      if (!key || seenFaculty.has(key)) continue;
      seenFaculty.add(key);
      activeFaculty.push(f);
    }
    activeFaculty.forEach(f => {
      f.category = normalizeFacultyCategory(f.category, f.designation);
    });

    values.facultyList = activeFaculty;

    const regular = activeFaculty.filter(f => f.category === 'teaching');
    const guest = activeFaculty.filter(f => f.category === 'guest');
    const vocational = activeFaculty.filter(f => f.category === 'vocational');
    const support = activeFaculty.filter(f => f.category === 'support');

    values.faculty = regular.map(f => [
      f.name,
      f.designation + (f.subject ? ' / ' + f.subject : ''),
      f.qualification || ''
    ]);
    values.guest = guest.map(f => [
      f.name,
      f.designation + (f.subject ? ' / ' + f.subject : ''),
      f.qualification || ''
    ]);
    values.vocational = vocational.map(f => [
      f.name,
      f.designation + (f.subject ? ' / ' + f.subject : ''),
      f.qualification || ''
    ]);
    values.support = support.map(f => [
      f.name,
      f.designation + (f.subject ? ' / ' + f.subject : ''),
      f.qualification || ''
    ]);

    values.staffPhotos = values.staffPhotos || {};
    activeFaculty.forEach(f => {
      if (f.photo_url) values.staffPhotos[f.name] = f.photo_url;
    });

    const princ = activeFaculty.find(f => /principal/i.test(f.designation));
    if (princ) {
      values.principal = values.principal || {};
      values.principal.name = princ.name;
      values.principal.designation = princ.designation;
      values.principal.qualification = princ.qualification;
      values.principal.email = values.principal.email || 'tgmssomaram.knr@gmail.com';
      values.principal.phone = values.principal.phone || '08727-285222';
      if (princ.photo_url) values.principalPhoto = princ.photo_url;
    }

    await supabase
      .from('school_profiles')
      .upsert({
        id: PROFILE_KEY,
        profile_key: PROFILE_KEY,
        values: values,
        revision: (profileRecord?.revision || 1) + 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_key' });

    // Also update local data/school-data.json if present
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        Object.assign(local, {
          facultyList: activeFaculty,
          faculty: values.faculty,
          guest: values.guest,
          vocational: values.vocational,
          support: values.support,
          staffPhotos: values.staffPhotos,
          principal: values.principal,
          principalPhoto: values.principalPhoto || local.principalPhoto
        });
        fs.writeFileSync(p, JSON.stringify(local, null, 2));
      }
    } catch {}
  } catch (err) {
    console.warn('Sync faculty to profile notice:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
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
    if (Array.isArray(data)) {
      data.forEach(f => {
        f.category = normalizeFacultyCategory(f.category, f.designation);
      });
    }
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, designation, subject, qualification, photo_url, order_index, is_active, category } = body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const cat = normalizeFacultyCategory(category, designation);

    let insertPayload = {
      name,
      designation,
      subject,
      qualification,
      photo_url,
      order_index: order_index || 0,
      is_active: is_active !== undefined ? is_active : true,
      category: cat
    };

    let { data, error } = await supabase
      .from('faculty')
      .insert([insertPayload])
      .select()
      .single();

    // Safe fallback if category column is not in Supabase yet
    if (error && (error.code === '42703' || String(error.message).includes('category'))) {
      delete insertPayload.category;
      const retry = await supabase
        .from('faculty')
        .insert([insertPayload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
      if (data) data.category = cat;
    }

    if (error) return res.status(500).json({ error: error.message });
    await syncFacultyToSchoolProfile();
    return res.status(201).json({ data });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { id, ...fields } = body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const updates = {};
    const allowed = ['name', 'category', 'designation', 'subject', 'qualification', 'photo_url', 'order_index', 'is_active'];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }
    if (updates.category) {
      updates.category = normalizeFacultyCategory(updates.category, updates.designation);
    }

    let { data, error } = await supabase
      .from('faculty')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    // Safe fallback if category column is not in Supabase yet
    if (error && (error.code === '42703' || String(error.message).includes('category'))) {
      const cat = updates.category;
      delete updates.category;
      const retry = await supabase
        .from('faculty')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
      if (data && cat) data.category = cat;
    }

    if (error) return res.status(500).json({ error: error.message });
    await syncFacultyToSchoolProfile();
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = body.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    await syncFacultyToSchoolProfile();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
