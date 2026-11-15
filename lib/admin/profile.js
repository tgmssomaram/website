import { supabase, isSupabaseConfigured } from '../supabase.js';
import fs from 'fs';
import path from 'path';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

const PROFILE_KEY = 'tgms_profile_tgms-somaram';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });

    let val = data?.values || {};
    if (typeof val === 'string') {
      try { val = JSON.parse(val); } catch {}
    }

    // Normalize values so admin form can read both formats
    val.name = val.settings?.schoolTitle || val.name || 'Telangana Model School & Junior College, Somaram';
    val.teluguName = val.settings?.teluguTitle || val.teluguName || 'తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం';
    val.udise = val.udiseCode || val.udise || '36131100206';
    val.collegeCode = val.collegeCode || '15124';
    val.principal = (val.principal && typeof val.principal === 'object' ? val.principal.name : val.principal) || 'Dr.Bandari Sampath Kumar';
    val.principalQualification = (val.principal && typeof val.principal === 'object' ? val.principal.qualification : val.principalQualification) || 'Phd in chemistry, B.Ed.';
    val.email = (val.principal && typeof val.principal === 'object' ? val.principal.email : val.email) || 'tgmssomaram.knr@gmail.com';
    val.phone = (val.principal && typeof val.principal === 'object' ? val.principal.phone : val.phone) || '08727-285222';
    val.address = val.address || 'Somaram (Village), Saidapur Mandal, Karimnagar District, Telangana – 505490';

    return res.status(200).json({ data: { ...data, values: val } });
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Fetch existing record
    const { data: existing, error: fetchError } = await supabase
      .from('school_profiles')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .maybeSingle();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    let currentValues = existing?.values || {};
    if (typeof currentValues === 'string') {
      try { currentValues = JSON.parse(currentValues); } catch {}
    }

    const mergedValues = { ...currentValues, ...body };

    // Deep sync to both formats (flat keys and nested keys used by main website)
    mergedValues.settings = mergedValues.settings || {};
    if (body.name) {
      mergedValues.name = body.name;
      mergedValues.settings.schoolTitle = body.name;
    }
    if (body.teluguName) {
      mergedValues.teluguName = body.teluguName;
      mergedValues.settings.teluguTitle = body.teluguName;
    }
    if (body.udise) {
      mergedValues.udise = body.udise;
      mergedValues.udiseCode = body.udise;
    }
    if (body.collegeCode) {
      mergedValues.collegeCode = body.collegeCode;
    }

    mergedValues.principal = mergedValues.principal || {};
    if (typeof mergedValues.principal === 'string') {
      mergedValues.principal = { name: mergedValues.principal };
    }
    if (body.principal) {
      mergedValues.principal.name = body.principal;
    }
    if (body.principalQualification) {
      mergedValues.principal.qualification = body.principalQualification;
    }
    if (body.email) {
      mergedValues.principal.email = body.email;
    }
    if (body.phone) {
      mergedValues.principal.phone = body.phone;
    }
    if (body.address) {
      mergedValues.address = body.address + (body.pinCode && !body.address.includes(body.pinCode) ? ' – ' + body.pinCode : '');
    }

    const nextRevision = (existing?.revision || 0) + 1;
    const { data, error } = await supabase
      .from('school_profiles')
      .upsert({
        id: PROFILE_KEY,
        profile_key: PROFILE_KEY,
        values: mergedValues,
        revision: nextRevision,
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_key' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Sync to local data/school-data.json
    try {
      const p = path.join(process.cwd(), 'data', 'school-data.json');
      if (fs.existsSync(p)) {
        const local = JSON.parse(fs.readFileSync(p, 'utf-8'));
        Object.assign(local, {
          settings: mergedValues.settings,
          principal: mergedValues.principal,
          address: mergedValues.address,
          udiseCode: mergedValues.udiseCode,
          collegeCode: mergedValues.collegeCode
        });
        fs.writeFileSync(p, JSON.stringify(local, null, 2));
      }
    } catch {}

    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
