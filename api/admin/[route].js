import loginHandler from '../../lib/admin/login.js';
import sessionHandler from '../../lib/admin/session.js';
import statsHandler from '../../lib/admin/stats.js';
import noticesHandler from '../../lib/admin/notices.js';
import facultyHandler from '../../lib/admin/faculty.js';
import galleryHandler from '../../lib/admin/gallery.js';
import inquiriesHandler from '../../lib/admin/inquiries.js';
import profileHandler from '../../lib/admin/profile.js';
import settingsHandler from '../../lib/admin/settings.js';
import uploadHandler from '../../lib/admin/upload.js';
import strengthHandler from '../../lib/admin/strength.js';
import alumniHandler from '../../lib/admin/alumni.js';
import principalMessageHandler from '../../lib/admin/principal-message.js';

const routes = {
  login: loginHandler,
  session: sessionHandler,
  stats: statsHandler,
  notices: noticesHandler,
  faculty: facultyHandler,
  gallery: galleryHandler,
  inquiries: inquiriesHandler,
  profile: profileHandler,
  settings: settingsHandler,
  upload: uploadHandler,
  strength: strengthHandler,
  alumni: alumniHandler,
  message: principalMessageHandler,
  'principal-message': principalMessageHandler
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  const route = req.query?.route || req.url?.split('?')[0].split('/').filter(Boolean).pop();
  const target = routes[route];

  if (!target) {
    return res.status(404).json({ error: `Admin route not found: ${route}` });
  }

  return target(req, res);
}

