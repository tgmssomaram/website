import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { data, name, folder = 'general' } = body;

  if (!data) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // Parse Data URL: data:image/jpeg;base64,...
  const match = data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  let contentType = 'image/jpeg';
  let base64Data = data;

  if (match) {
    contentType = match[1];
    base64Data = match[2];
  }

  const buffer = Buffer.from(base64Data, 'base64');

  // Sanitize filename
  const rawName = (name || 'upload.jpg').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const ext = path.extname(rawName) || (contentType.includes('png') ? '.png' : '.jpg');
  const baseName = path.basename(rawName, ext);
  const fileName = `${Date.now()}-${baseName}${ext}`;
  const storagePath = `${folder}/${fileName}`;

  // 1. Try Supabase Storage
  if (isSupabaseConfigured()) {
    try {
      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasBucket = buckets && buckets.some(b => b.name === 'school-media');
      if (!hasBucket) {
        await supabase.storage.createBucket('school-media', { public: true });
      }

      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('school-media')
        .upload(storagePath, buffer, {
          contentType: contentType,
          upsert: true
        });

      if (!uploadError && uploadResult) {
        const { data: urlData } = supabase.storage
          .from('school-media')
          .getPublicUrl(storagePath);

        if (urlData && urlData.publicUrl) {
          return res.status(200).json({
            success: true,
            url: urlData.publicUrl,
            storage: 'supabase',
            name: fileName
          });
        }
      } else if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
      }
    } catch (e) {
      console.warn('Supabase storage exception:', e.message);
    }
  }

  // 2. Local Fallback (filesystem)
  try {
    const uploadDir = path.join(__dirname, '..', '..', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, buffer);

    return res.status(200).json({
      success: true,
      url: `/images/uploads/${fileName}`,
      storage: 'local',
      name: fileName
    });
  } catch (fsErr) {
    console.error('Local file save error:', fsErr);
    // 3. Fallback to data URL if file system fails
    return res.status(200).json({
      success: true,
      url: data,
      storage: 'inline',
      name: fileName
    });
  }
}

