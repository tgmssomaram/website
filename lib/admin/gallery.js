import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

async function syncGalleryToSchoolProfile() {
  if (!isSupabaseConfigured()) return;
  try {
    const { data: items } = await supabase
      .from('gallery_items')
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

    values.gallery = items.map(g => ({
      src: g.image_url,
      title: g.title,
      te: g.caption || g.title,
      category: g.category || 'School Activities'
    }));

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
        local.gallery = values.gallery;
        fs.writeFileSync(p, JSON.stringify(local, null, 2));
      }
    } catch {}
  } catch (err) {
    console.warn('Sync gallery to profile notice:', err.message);
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
    let query = supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }
    let { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    // Auto-seed default gallery photos if database has none
    if (!data || data.length === 0) {
      const seedItems = [
        {
          title: 'Parent–teacher meeting',
          image_url: '/images/parents-meeting.jpg',
          category: 'School Activities',
          caption: 'తల్లిదండ్రుల సమావేశం · Parents discussing student academic progress',
          is_active: true
        },
        {
          title: 'Yoga and well-being',
          image_url: '/images/yoga-session.jpg',
          category: 'Events',
          caption: 'యోగా కార్యక్రమం · Morning yoga and wellness session',
          is_active: true
        },
        {
          title: 'School–parent interaction',
          image_url: '/images/meeting-address.jpg',
          category: 'School Activities',
          caption: 'పాఠశాల–తల్లిదండ్రుల ముఖాముఖి · Head of school addressing the gathering',
          is_active: true
        },
        {
          title: 'Parents participating in school activities',
          image_url: '/images/parents-participation.jpg',
          category: 'School Activities',
          caption: 'పాఠశాల కార్యక్రమంలో తల్లిదండ్రుల భాగస్వామ్యం · Active parent participation',
          is_active: true
        }
      ];
      try {
        await supabase.from('gallery_items').insert(seedItems);
        const refetch = await query;
        data = refetch.data || seedItems;
      } catch {}
    }

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

    await syncGalleryToSchoolProfile();
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

    await syncGalleryToSchoolProfile();
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = body.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    await syncGalleryToSchoolProfile();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
