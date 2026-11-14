import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import fs from 'fs';
import path from 'path';

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

function getFallbackData() {
  try {
    const p = path.join(process.cwd(), 'data', 'school-data.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (e) {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Read school profile + active faculty
  if (req.method === 'GET') {
    if (isSupabaseConfigured()) {
      try {
        const [profileRes, facultyRes] = await Promise.all([
          supabase
            .from('school_profiles')
            .select('values, revision')
            .eq('profile_key', PROFILE_KEY)
            .maybeSingle(),
          supabase
            .from('faculty')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true })
        ]);

        let profileValues = profileRes.data?.values || getFallbackData() || {};
        if (typeof profileValues === 'string') {
          try { profileValues = JSON.parse(profileValues); } catch {}
        }

        if (facultyRes.data && facultyRes.data.length > 0) {
          const facultyRows = facultyRes.data;
          profileValues.facultyList = facultyRows;
          profileValues.faculty = facultyRows.map(f => [
            f.name,
            f.designation + (f.subject ? ' / ' + f.subject : ''),
            f.qualification || ''
          ]);
          profileValues.staffPhotos = profileValues.staffPhotos || {};
          facultyRows.forEach(f => {
            if (f.photo_url) profileValues.staffPhotos[f.name] = f.photo_url;
          });

          const princ = facultyRows.find(f => /principal/i.test(f.designation));
          if (princ) {
            profileValues.principal = profileValues.principal || {};
            profileValues.principal.name = princ.name;
            profileValues.principal.designation = princ.designation;
            profileValues.principal.qualification = princ.qualification;
            if (princ.photo_url) profileValues.principalPhoto = princ.photo_url;
          }
        }

        return res.status(200).json({
          values: {
            [PROFILE_KEY]: JSON.stringify(profileValues)
          },
          revision: profileRes.data?.revision || 1
        });
      } catch (err) {
        console.error('Supabase query error:', err);
      }
    }

    // Fallback to local data file
    const localData = getFallbackData();
    return res.status(200).json({
      values: {
        [PROFILE_KEY]: JSON.stringify(localData || {})
      },
      revision: 1
    });
  }

  // PUT: Save updated school profile (from Admin Panel)
  if (req.method === 'PUT') {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({
        error: 'Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY to your Vercel Environment Variables.'
      });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const valuesObj = body.values || {};
      const profileData = valuesObj[PROFILE_KEY] || valuesObj;
      const parsed = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
      const nextRevision = (body.revision || 1) + 1;

      const { data, error } = await supabase
        .from('school_profiles')
        .upsert({
          id: PROFILE_KEY,
          profile_key: PROFILE_KEY,
          values: parsed,
          revision: nextRevision,
          updated_at: new Date().toISOString()
        }, { onConflict: 'profile_key' })
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        revision: nextRevision
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to update content' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
