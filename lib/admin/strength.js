import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

const DEFAULT_STRENGTH = {
  year: '2026–27',
  groups: [
    {
      title: 'School · Classes VI–X',
      rows: [['VI', 48, 33], ['VII', 55, 21], ['VIII', 63, 34], ['IX', 51, 46], ['X', 55, 39]]
    },
    {
      title: 'Junior College · First Year (Intermediate)',
      rows: [['MPC', 18, 28], ['BiPC', 4, 37], ['CEC', 15, 16], ['ACE', 7, 10]]
    },
    {
      title: 'Junior College · Second Year (Intermediate)',
      rows: [['MPC', 16, 33], ['BiPC', 0, 39], ['CEC', 15, 11]]
    }
  ],
  sections: [['IX A', 49], ['IX B', 50], ['X A', 46], ['X B', 48], ['I CEC', 31], ['II CEC', 25]]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  // GET: Fetch current strength data
  if (req.method === 'GET') {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('school_profiles')
          .select('*')
          .eq('profile_key', PROFILE_KEY)
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch error for strength:', error.message);
        } else if (data && data.values) {
          let val = data.values;
          if (typeof val === 'string') {
            try { val = JSON.parse(val); } catch {}
          }
          if (val.strength && val.strength.groups) {
            return res.status(200).json({ data: val.strength });
          }
        }
      } catch (e) {
        console.warn('Strength fetch warning:', e.message);
      }
    }

    // Fallback to local data
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        if (local.strength) return res.status(200).json({ data: local.strength });
      }
    } catch {}

    return res.status(200).json({ data: DEFAULT_STRENGTH });
  }

  // PUT: Update strength data
  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const strengthData = body.strength || body;

    if (!strengthData || !Array.isArray(strengthData.groups)) {
      return res.status(400).json({ error: 'Invalid strength data structure' });
    }

    let updatedRecord = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('school_profiles')
          .select('*')
          .eq('profile_key', PROFILE_KEY)
          .maybeSingle();

        let currentValues = existing?.values || {};
        if (typeof currentValues === 'string') {
          try { currentValues = JSON.parse(currentValues); } catch {}
        }

        currentValues.strength = strengthData;
        const nextRevision = (existing?.revision || 1) + 1;

        const { data, error } = await supabase
          .from('school_profiles')
          .upsert({
            id: PROFILE_KEY,
            profile_key: PROFILE_KEY,
            values: currentValues,
            revision: nextRevision,
            updated_at: new Date().toISOString()
          }, { onConflict: 'profile_key' })
          .select()
          .single();

        if (error) throw error;
        updatedRecord = data;

        // Also sync rows to public.student_strength relational table
        try {
          const rowsToInsert = [];
          let idx = 1;
          for (const group of strengthData.groups || []) {
            const groupType = /Classes VI|High School/i.test(group.title) ? 'high_school' :
                             /First Year/i.test(group.title) ? 'intermediate_1' : 'intermediate_2';
            for (const r of group.rows || []) {
              rowsToInsert.push({
                academic_year: strengthData.year || '2026–27',
                group_type: groupType,
                class_name: String(r[0]),
                boys: Number(r[1]) || 0,
                girls: Number(r[2]) || 0,
                order_index: idx++,
                is_active: true
              });
            }
          }
          if (rowsToInsert.length) {
            await supabase.from('student_strength').delete().eq('academic_year', strengthData.year || '2026–27');
            await supabase.from('student_strength').insert(rowsToInsert);
          }
        } catch (dbErr) {
          console.warn('student_strength table sync notice:', dbErr.message);
        }
      } catch (err) {
        console.error('Supabase update strength error:', err);
        return res.status(500).json({ error: err.message });
      }
    }

    // Sync to local data/school-data.json
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        local.strength = strengthData;
        fs.writeFileSync(p, JSON.stringify(local, null, 2), 'utf-8');
      }
    } catch (writeErr) {
      console.warn('Could not write local data/school-data.json:', writeErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Student enrolment & strength updated successfully',
      data: strengthData
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
