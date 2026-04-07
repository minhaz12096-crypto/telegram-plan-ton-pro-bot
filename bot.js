const { Telegraf } = require('telegraf');

// 🔴 আপনার বটের টোকেন দিন 🔴
const bot = new Telegraf('8613002021:AAE7pB-Pf8CtiUtGq1Z2PqxkKAB61hSCXB0'); 
const WEB_APP_URL = 'https://telegram-plan-ton-pro-bot.vercel.app'; // আপনার গেমের লিংক

// Start Command
bot.start((ctx) => {
    ctx.reply('🌕 Welcome to Full Moon Farm Pro!\n\nPlant, grow, and earn real TON. Click below to open the app:', {
        reply_markup: {
            inline_keyboard: [[{ text: "🌕 Play Full Moon Farm", web_app: { url: WEB_APP_URL } }]]
        }
    });
});

// এই বটটি শুধুমাত্র মেসেজ পাঠানোর জন্য ব্যাকগ্রাউন্ডে কাজ করবে। 
// ফায়ারবেস থেকে ডাটা নিয়ে Frontend (index.html) মেসেজ পাঠানোর রিকোয়েস্ট করবে।

bot.launch();
console.log('Bot is running perfectly...');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
