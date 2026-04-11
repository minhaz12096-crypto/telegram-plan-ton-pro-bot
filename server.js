const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const admin = require('firebase-admin');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

// Initialize Firebase Admin (Using service account)
const serviceAccount = require('./firebase-service-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.7956497373:AAFdqSrJkFywUlIxKbll25aZkg3e6tURfpE;
const upload = multer({ dest: 'uploads/' }); // For file features

// --- SECURITY: Telegram InitData Validation ---
const verifyTelegramWebAppData = (req, res, next) => {
    const initData = req.headers['x-telegram-init-data'];
    if (!initData) return res.status(401).json({ error: 'No init data provided' });

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash === hash) {
        // Data is safe and from Telegram
        req.user = JSON.parse(urlParams.get('user'));
        next();
    } else {
        res.status(403).json({ error: 'Invalid InitData. Access denied.' });
    }
};

// --- SECURITY: Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests, please wait.'
});

// --- HELPER: Get dynamic API Keys from Firebase ---
async function getApiKeys() {
    const doc = await db.collection('config').doc('api_keys').get();
    return doc.data();
}

// ==========================================
// 🚀 THE 8 CORE FEATURES (API ENDPOINTS)
// ==========================================

// 1. Dual-AI Chat
app.post('/api/chat', verifyTelegramWebAppData, apiLimiter, async (req, res) => {
    const { prompt, models } = req.body; // e.g., models: ['gpt-4', 'gemini']
    const keys = await getApiKeys();
    
    // Abstracted logic: You would call OpenAI/Gemini SDKs here
    const responses = {};
    if (models.includes('gpt-4')) responses['gpt'] = `GPT response to: ${prompt}`;
    if (models.includes('gemini')) responses['gemini'] = `Gemini response to: ${prompt}`;
    
    // Save to Firebase Memory
    await db.collection('users').doc(String(req.user.id)).collection('history').add({
        prompt, responses, timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json(responses);
});

// 2. Text-to-Video Generation
app.post('/api/text-to-video', verifyTelegramWebAppData, apiLimiter, async (req, res) => {
    const { prompt } = req.body;
    const keys = await getApiKeys();
    // Use Replicate or Luma API here using keys.replicate_key
    res.json({ video_url: "https://your-cloud-storage.com/generated-video.mp4" });
});

// 3. Name Styler (Unicode Mapping)
app.post('/api/style-name', verifyTelegramWebAppData, async (req, res) => {
    const { name } = req.body;
    // Example mapping - expand this to 15+ styles
    const styles = {
        gothic: name.split('').map(c => c + '\u0334').join(''), // Pseudo-gothic
        spaced: name.split('').join(' '),
        uppercase: name.toUpperCase()
    };
    res.json({ styles });
});

// 4. Multi-Language Code File Creator
app.post('/api/create-code-file', verifyTelegramWebAppData, async (req, res) => {
    const { filename, extension, code } = req.body;
    const fullFileName = `${filename}.${extension}`;
    // Logic: Save 'code' to a file in a temp directory, upload to S3/Firebase Storage, return URL
    res.json({ file_url: `https://your-server.com/downloads/${fullFileName}` });
});

// 5 & 6 & 7 & 8. File / Media / Music Handlers
app.post('/api/upload', verifyTelegramWebAppData, upload.single('file'), async (req, res) => {
    const fileType = req.body.type; // 'music', 'media', 'document'
    // Logic: 
    // 1. Process req.file.path based on type (e.g., ffmpeg to convert to MP4/PNG)
    // 2. Upload to Cloud Storage
    // 3. Return public URL
    res.json({ url: "https://cloud-storage.com/converted-file.mp4" });
});

// --- ADMIN DASHBOARD ROUTES ---
app.post('/api/admin/update-keys', verifyTelegramWebAppData, async (req, res) => {
    // Basic hardcoded check (better to verify against Firebase Admin list)
    if (req.user.id !== 8514470262) return res.status(403).json({error: "Admin only"});
    
    const { newKeys } = req.body;
    await db.collection('config').doc('api_keys').set(newKeys, { merge: true });
    res.json({ success: true, message: "Keys updated in real-time." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
