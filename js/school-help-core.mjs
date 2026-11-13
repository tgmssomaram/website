// Public information only. No model calls, credentials, personal records or chat storage.
export function safeWebsite(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; }
  catch { return null; }
}
const text = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.en || '';
export function schoolAnswer(question, data = {}, schools = [], language = 'en') {
  const q = String(question).trim().toLowerCase();
  const te = language === 'te', hi = language === 'hi';
  const say = (en, tel, hin) => te ? tel : hi ? hin : en;
  const answer = (body, links) => ({body, links});
  if (!q || q.length > 500) return answer(say('Please enter a question of 1–500 characters.', '1–500 అక్షరాల్లో ప్రశ్న అడగండి.', 'कृपया 1–500 अक्षरों में प्रश्न लिखें।'), []);
  if (/password|otp|aadhaar|aadhar|student.*(phone|address|birth)|పాస్‌వర్డ్|ఆధార్|ओटीपी|पासवर्ड/.test(q))
    return answer(say('I can help with public school information. Please do not share passwords, OTPs or private student details.', 'నేను పబ్లిక్ స్కూల్ సమాచారంలో సహాయపడతాను. పాస్‌వర్డ్‌లు, OTPలు, విద్యార్థుల వ్యక్తిగత వివరాలు పంపవద్దు.', 'मैं सार्वजनिक विद्यालय जानकारी में मदद करता हूँ। पासवर्ड, OTP या विद्यार्थियों की निजी जानकारी साझा न करें।'), [['School office', '#contact']]);
  if (/fee|deadline|last date|exam date|ఫీజు|తేదీ|గడువు|शुल्क|तिथि/.test(q))
    return answer(say('Please check the latest admission notification for fees, eligibility and dates. I do not have a verified current deadline or fee to quote.', 'ఫీజులు, అర్హత, తేదీల కోసం తాజా ప్రవేశ ప్రకటన చూడండి. నిర్ధారించిన ప్రస్తుత ఫీజు లేదా చివరి తేదీ నా వద్ద లేదు.', 'शुल्क, पात्रता और तारीखों के लिए नवीनतम प्रवेश अधिसूचना देखें। मेरे पास सत्यापित वर्तमान शुल्क या अंतिम तारीख नहीं है।'), [['Admissions', '#admissions'], ['Official TGMS admissions portal', 'https://telanganams.cgg.gov.in/TGMSWEB20/#/']]);
  if (/admi|apply|entrance|msat|ప్రవేశ|దరఖాస్తు|అడ్మిషన్|प्रवेश|आवेदन/.test(q))
    return answer(say('Open our Admissions page for school information and use the official TGMS portal for the current notification and application. Confirm eligibility, fees and dates before applying.', 'స్కూల్ వివరాలకు ప్రవేశాల పేజీ చూడండి. తాజా ప్రకటన, దరఖాస్తుకు అధికారిక TGMS పోర్టల్ ఉపయోగించండి. అర్హత, ఫీజు, తేదీలు నిర్ధారించుకోండి.', 'विद्यालय विवरण के लिए प्रवेश पृष्ठ और नवीनतम अधिसूचना तथा आवेदन के लिए आधिकारिक TGMS पोर्टल देखें।'), [['Admissions', '#admissions'], ['Official TGMS admissions portal', 'https://telanganams.cgg.gov.in/TGMSWEB20/#/']]);
  if (/principal|ప్రిన్సిపాల్|ప్రిన్సిపల్|प्रधानाचार्य/.test(q)) {
    const p = data.principal || {};
    return answer([p.name, p.designation, p.qualification].filter(Boolean).join(' · ') || say('Principal details have not been supplied yet.', 'ప్రిన్సిపాల్ వివరాలు ఇంకా అందలేదు.', 'प्रधानाचार्य का विवरण अभी उपलब्ध नहीं है।'), [['Principal profile', '#principal']]);
  }
  if (/contact|phone|address|email|సంప్రద|ఫోన్|చిరునామా|సంపర్క|संपर्क|पता/.test(q))
    return answer([data.address, data.principal?.phone, data.principal?.email].filter(Boolean).join('\n') || say('Please contact the school through the Contact page.', 'సంప్రదింపు పేజీ ద్వారా స్కూల్‌ను సంప్రదించండి.', 'संपर्क पृष्ठ से विद्यालय से संपर्क करें।'), [['School contact details', '#contact']]);
  if (/book|textbook|download|పుస్తక|డౌన్‌లోడ్|पुस्तक|किताब/.test(q))
    return answer(say('Use Books Download for textbook resources and the Student Portal for learning links.', 'పాఠ్యపుస్తకాలకు Books Download, అభ్యాస వనరులకు Student Portal చూడండి.', 'पाठ्यपुस्तकों के लिए Books Download और अध्ययन संसाधनों के लिए Student Portal देखें।'), [['Books Download', '#books'], ['Student Portal', '#portal']]);
  if (/faculty|teacher|staff|సిబ్బంది|టీచర్|ఉపాధ్యాయ|शिक्षक/.test(q))
    return answer(say('Our Team lists the public staff details supplied by this school.', 'ఈ స్కూల్ అందించిన పబ్లిక్ సిబ్బంది వివరాలు Our Team పేజీలో ఉన్నాయి.', 'विद्यालय द्वारा दिए गए सार्वजनिक शिक्षक विवरण Our Team पृष्ठ पर हैं।'), [['Our Team', '#faculty']]);
  if (/course|subject|academ|కోర్సు|విషయ|విద్యా|पाठ्यक्रम/.test(q))
    return answer(say('Please see Academic Programmes for this school’s published courses and subjects. Admission capacity and current enrolment are different figures.', 'ఈ స్కూల్ ప్రచురించిన కోర్సులు, సబ్జెక్టుల కోసం విద్యా కార్యక్రమాల పేజీ చూడండి. సీట్ల సామర్థ్యం, ప్రస్తుత విద్యార్థుల సంఖ్య వేర్వేరు.', 'विद्यालय के प्रकाशित पाठ्यक्रम और विषय अकादमिक पृष्ठ पर देखें। सीट क्षमता और वर्तमान छात्र संख्या अलग हैं।'), [['Academic programmes', '#academics'], ['School strength', '#strength']]);
  const tokens = q.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(w => w.length > 2 && !['school','schools','model','telangana','website','find','show','where','the','link','mandal','district'].includes(w));
  const matches = tokens.length ? schools.filter(s => tokens.some(w => [s.location,s.district,s.mandal].join(' ').toLowerCase().includes(w))) : [];
  if (/194|director|schools|స్కూల్స్|పాఠశాలలు|जिले|विद्यालयों/.test(q) || matches.length) {
    const selected = matches.slice(0, 5);
    const body = selected.length ? selected.map(s => `${s.location} · ${s.district}`).join('\n') : say('The directory lists 194 Model Schools in 29 districts. Search by school, district or mandal. Only published website links are shown.', 'డైరెక్టరీలో 29 జిల్లాల్లోని 194 మోడల్ స్కూల్స్ ఉన్నాయి. స్కూల్, జిల్లా, మండలం పేరుతో వెతకండి. అందుబాటులో ఉన్న వెబ్‌సైట్ లింకులే చూపిస్తాము.', 'निर्देशिका में 29 जिलों के 194 मॉडल स्कूल हैं। विद्यालय, जिला या मंडल से खोजें। केवल उपलब्ध वेबसाइट लिंक दिखाए जाते हैं।');
    return answer(body, [...selected.filter(s=>safeWebsite(s.website)).map(s=>[s.location+' website',safeWebsite(s.website)]), ['194 Schools directory', '#directory']]);
  }
  return answer(say('I can guide you to admissions, school websites, the principal, contact details, staff and textbooks. I cannot verify that question from the school’s published information. Please check with the school office.', 'ప్రవేశాలు, స్కూల్ వెబ్‌సైట్లు, ప్రిన్సిపాల్, సంప్రదింపు, సిబ్బంది, పుస్తకాల గురించి సహాయపడగలను. ఈ ప్రశ్నకు ప్రచురించిన సమాచారంతో సమాధానం నిర్ధారించలేను. స్కూల్ కార్యాలయాన్ని సంప్రదించండి.', 'मैं प्रवेश, विद्यालय वेबसाइट, प्रधानाचार्य, संपर्क, शिक्षक और पुस्तकों में सहायता कर सकता हूँ। इस प्रश्न का उत्तर प्रकाशित जानकारी से सत्यापित नहीं कर सकता। विद्यालय कार्यालय से संपर्क करें।'), [['Contact the school', '#contact']]);
}
