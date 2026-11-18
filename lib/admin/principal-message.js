import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const DEFAULT_MESSAGE = {
  title: 'Principal’s Message',
  teluguTitle: 'ప్రిన్సిపాల్ సందేశం',
  text: 'Welcome to Telangana Model School & Junior College, Somaram. Our institution is dedicated to nurturing young minds with high-quality English medium education, modern scientific inquiry, and strong ethical values. With modern laboratories, digital classrooms, and 100% free education provided by the Government of Telangana, we empower every student to achieve excellence.',
  teluguText: 'సోమారం తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాలకు స్వాగతం. నాణ్యమైన ఆంగ్ల మాధ్యమ విద్య, నైతిక విలువలు, శాస్త్రీయ దృక్పథాన్ని పెంపొందించడమే మా లక్ష్యం. అత్యాధునిక ప్రయోగశాలలు, డిజిటల్ తరగతులు మరియు రాష్ట్ర ప్రభుత్వ 100% ఉచిత విద్యా సదుపాయాలతో విద్యార్థులను భావి భారత పౌరులుగా తీర్చిదిద్దుతున్నాము.',
  importantTitle: 'Principal FAC · Dr. Bandari Sampath Kumar',
  importantText: 'Admissions for Classes VI to XII are conducted through the state CGG entrance portal. Textbooks, uniforms, and mid-day meals are 100% free.',
  image: 'images/parents-meeting.jpg',
  imageAlt: 'Principal address and parent-teacher meeting',
  imageCaption: 'Dr. Bandari Sampath Kumar, Principal FAC addressing parents and students.',
  links: [
    { label: 'TG Model Schools Portal', url: 'https://telanganams.cgg.gov.in/TGMSWEB20/#/' },
    { label: 'Academic Calendar 2026–27', url: 'https://tgmssomaram.in/#calendar' }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  // GET: Fetch current principal message & press note
  if (req.method === 'GET') {
    if (isSupabaseConfigured()) {
      try {
        // Try dedicated principal_messages table first
        const { data: dbMsg } = await supabase
          .from('principal_messages')
          .select('*')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (dbMsg) {
          return res.status(200).json({
            data: {
              title: dbMsg.title || DEFAULT_MESSAGE.title,
              teluguTitle: dbMsg.telugu_title || DEFAULT_MESSAGE.teluguTitle,
              text: dbMsg.message || DEFAULT_MESSAGE.text,
              teluguText: dbMsg.telugu_message || DEFAULT_MESSAGE.teluguText,
              importantTitle: dbMsg.important_title || DEFAULT_MESSAGE.importantTitle,
              importantText: dbMsg.important_text || DEFAULT_MESSAGE.importantText,
              image: dbMsg.image_url || DEFAULT_MESSAGE.image,
              imageAlt: dbMsg.image_caption || DEFAULT_MESSAGE.imageAlt,
              imageCaption: dbMsg.image_caption || DEFAULT_MESSAGE.imageCaption,
              links: Array.isArray(dbMsg.links) ? dbMsg.links : DEFAULT_MESSAGE.links
            }
          });
        }

        // Check school_profiles values
        const { data: profileRec } = await supabase
          .from('school_profiles')
          .select('values')
          .eq('profile_key', PROFILE_KEY)
          .maybeSingle();

        if (profileRec && profileRec.values) {
          let val = profileRec.values;
          if (typeof val === 'string') {
            try { val = JSON.parse(val); } catch {}
          }
          if (val.principalPress) {
            return res.status(200).json({ data: Object.assign({}, DEFAULT_MESSAGE, val.principalPress) });
          }
        }
      } catch (err) {
        console.warn('Principal message Supabase fetch error:', err.message);
      }
    }

    // Fallback to local school-data.json
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        if (local.principalPress) {
          return res.status(200).json({ data: Object.assign({}, DEFAULT_MESSAGE, local.principalPress) });
        }
      }
    } catch {}

    return res.status(200).json({ data: DEFAULT_MESSAGE });
  }

  // PUT: Update principal message
  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const payload = {
      title: (body.title || 'Principal’s Message').trim(),
      teluguTitle: (body.teluguTitle || '').trim(),
      text: (body.text || '').trim(),
      teluguText: (body.teluguText || '').trim(),
      importantTitle: (body.importantTitle || 'Principal Important Message').trim(),
      importantText: (body.importantText || '').trim(),
      image: (body.image || '').trim(),
      imageAlt: (body.imageAlt || '').trim(),
      imageCaption: (body.imageCaption || '').trim(),
      links: Array.isArray(body.links) ? body.links : []
    };

    if (isSupabaseConfigured()) {
      try {
        // 1. Upsert into public.principal_messages table
        await supabase
          .from('principal_messages')
          .insert([{
            title: payload.title,
            telugu_title: payload.teluguTitle,
            message: payload.text,
            telugu_message: payload.teluguText,
            important_title: payload.importantTitle,
            important_text: payload.importantText,
            image_url: payload.image,
            image_caption: payload.imageCaption,
            links: payload.links,
            is_active: true,
            updated_at: new Date().toISOString()
          }]);

        // 2. Sync to school_profiles values.principalPress
        const { data: profileRecord } = await supabase
          .from('school_profiles')
          .select('*')
          .eq('profile_key', PROFILE_KEY)
          .maybeSingle();

        let values = profileRecord?.values || {};
        if (typeof values === 'string') {
          try { values = JSON.parse(values); } catch {}
        }

        values.principalPress = payload;

        await supabase
          .from('school_profiles')
          .upsert({
            id: PROFILE_KEY,
            profile_key: PROFILE_KEY,
            values: values,
            revision: (profileRecord?.revision || 1) + 1,
            updated_at: new Date().toISOString()
          }, { onConflict: 'profile_key' });
      } catch (err) {
        console.warn('Principal message Supabase update warning:', err.message);
      }
    }

    // Sync to local data/school-data.json
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        local.principalPress = payload;
        fs.writeFileSync(p, JSON.stringify(local, null, 2));
      }
    } catch (err) {
      console.warn('Local file write warning:', err.message);
    }

    return res.status(200).json({ success: true, data: payload });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
