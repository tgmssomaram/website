import { supabase, isSupabaseConfigured } from '../supabase.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('tgms_admin_session=authenticated');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!isSupabaseConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const search = (req.query.search || '').trim();
  const offset = (page - 1) * limit;

  let countQuery = supabase.from('feedback').select('*', { count: 'exact', head: true });
  let dataQuery = supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    const searchFilter = `name.ilike.%${search}%,contact.ilike.%${search}%,message.ilike.%${search}%`;
    countQuery = countQuery.or(searchFilter);
    dataQuery = dataQuery.or(searchFilter);
  }

  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

  if (countResult.error) return res.status(500).json({ error: countResult.error.message });
  if (dataResult.error) return res.status(500).json({ error: dataResult.error.message });

  const total = countResult.count || 0;
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    data: dataResult.data,
    total,
    page,
    limit,
    totalPages
  });
}
