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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Real-time sync of school profile + active faculty + gallery + notices
  if (req.method === 'GET') {
    if (isSupabaseConfigured()) {
      try {
        const [profileRes, facultyRes, galleryRes, noticesRes] = await Promise.all([
          supabase
            .from('school_profiles')
            .select('values, revision')
            .eq('profile_key', PROFILE_KEY)
            .maybeSingle(),
          supabase
            .from('faculty')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true }),
          supabase
            .from('gallery_items')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),
          supabase
            .from('notices')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
        ]);

        let profileValues = profileRes.data?.values || getFallbackData() || {};
        if (typeof profileValues === 'string') {
          try { profileValues = JSON.parse(profileValues); } catch {}
        }

        // Live Faculty Sync
        if (facultyRes.data && facultyRes.data.length > 0) {
          const facultyRows = facultyRes.data.filter(f => f && f.is_active !== false);

          function normalizeCategory(cat, des) {
            if (cat && ['teaching', 'guest', 'vocational', 'support'].includes(cat)) return cat;
            const d = String(des || '').toUpperCase();
            if (d.includes('HBT') || d.includes('GUEST')) return 'guest';
            if (d.includes('VOCATIONAL') || d.includes('TRAINER')) return 'vocational';
            if (d.includes('SUPPORT') || d.includes('ATTENDER') || d.includes('WATCHMAN') || 
                d.includes('OFFICE') || d.includes('ASSISTANT') || d.includes('SWEEPER') || 
                d.includes('SCAVENGER') || d.includes('OPERATOR') || d.includes('RECORD') || 
                d.includes('PHYSICAL DIRECTOR') || d.includes('PD') || d.includes('STAFF')) {
              return 'support';
            }
            return 'teaching';
          }

          facultyRows.forEach(f => {
            f.category = normalizeCategory(f.category, f.designation);
          });

          profileValues.facultyList = facultyRows;

          const regular = facultyRows.filter(f => f.category === 'teaching');
          const guest = facultyRows.filter(f => f.category === 'guest');
          const vocational = facultyRows.filter(f => f.category === 'vocational');
          const support = facultyRows.filter(f => f.category === 'support');

          profileValues.faculty = regular.map(f => [
            f.name,
            f.designation + (f.subject ? ' / ' + f.subject : ''),
            f.qualification || ''
          ]);
          profileValues.guest = guest.map(f => [
            f.name,
            f.designation + (f.subject ? ' / ' + f.subject : ''),
            f.qualification || ''
          ]);
          profileValues.vocational = vocational.map(f => [
            f.name,
            f.designation + (f.subject ? ' / ' + f.subject : ''),
            f.qualification || ''
          ]);
          profileValues.support = support.map(f => [
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
            profileValues.principal.email = profileValues.principal.email || 'tgmssomaram.knr@gmail.com';
            profileValues.principal.phone = profileValues.principal.phone || '08727-285222';
            if (princ.photo_url) profileValues.principalPhoto = princ.photo_url;
          }
        } else {
          profileValues.guest = profileValues.guest || [];
          profileValues.vocational = profileValues.vocational || [];
          profileValues.support = profileValues.support || [];
        }

        // Live Gallery Sync
        if (Array.isArray(galleryRes.data)) {
          profileValues.gallery = galleryRes.data.map(g => ({
            src: g.image_url,
            title: g.title,
            te: g.caption || g.title,
            category: g.category || 'School Activities'
          }));
        }

        // Live Notices & Flash News Sync
        if (Array.isArray(noticesRes.data)) {
          const mappedNotices = noticesRes.data.map(n => ({
            id: n.id,
            title: n.title,
            detail: n.detail || n.title,
            date: n.date || new Date().toISOString().slice(0, 10)
          }));
          profileValues.notices = mappedNotices;
          profileValues.flashNews = mappedNotices;
        }

        // Clean out any lingering false or mock data
        profileValues.showAdmissionSeats = Boolean(profileValues.showAdmissionSeats && profileValues.seatsConfig);
        if (Array.isArray(profileValues.flashNews)) {
          profileValues.flashNews = profileValues.flashNews.filter(n => n && n.title && !String(n.id).startsWith('somaram-welcome-'));
        }
        if (Array.isArray(profileValues.notices)) {
          profileValues.notices = profileValues.notices.filter(n => n && n.title && !String(n.id).startsWith('somaram-welcome-'));
        }

        // Ensure strength, alumni, and principalPress are present
        const fallback = getFallbackData();
        if (!profileValues.strength && fallback?.strength) {
          profileValues.strength = fallback.strength;
        }
        if (!profileValues.alumni && Array.isArray(fallback?.alumni)) {
          profileValues.alumni = fallback.alumni;
        }
        if (!profileValues.principalPress && fallback?.principalPress) {
          profileValues.principalPress = fallback.principalPress;
        }

        return res.status(200).json({
          values: {
            [PROFILE_KEY]: JSON.stringify(profileValues)
          },
          revision: profileRes.data?.revision || 1
        });
      } catch (err) {
        console.error('Supabase query error in api/content:', err);
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

      if (error) {
        console.error('Failed to update Supabase school profile:', error);
        return res.status(500).json({ error: error.message });
      }

      // Also update local file if present
      try {
        const localPath = path.join(process.cwd(), 'data', 'school-data.json');
        if (fs.existsSync(localPath)) {
          fs.writeFileSync(localPath, JSON.stringify(parsed, null, 2), 'utf-8');
        }
      } catch (writeErr) {
        console.warn('Could not write local data/school-data.json:', writeErr.message);
      }

      return res.status(200).json({
        success: true,
        revision: nextRevision,
        data
      });
    } catch (err) {
      console.error('Content update error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
