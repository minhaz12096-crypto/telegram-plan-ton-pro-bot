const { Telegraf } = require('telegraf');

// আপনার বটের টোকেন দিন
const bot = new Telegraf('8613002021:AAE7pB-Pf8CtiUtGq1Z2PqxkKAB61hSCXB0'); 

// আপনার টেলিগ্রাম ইউজার আইডি (শুধুমাত্র আপনি অ্যাডমিন হবেন)
const ADMIN_ID = 8514470262; 
// যে চ্যানেলে জয়েন করতে হবে তার ইউজারনেম (অ্যাডমিন হিসেবে বট থাকতে হবে)
const TASK_CHANNEL = '@bBmw4PdWOrY5ZmI9'; 

// Start Command
bot.start((ctx) => {
    ctx.reply('Welcome to Plant-TON Pro! 🌕\n\nClick the button below to open the Web App.', {
        reply_markup: {
            inline_keyboard: [[{ text: "Play Now", web_app: { url: "https://telegram-plan-ton-pro-bot.vercel.app/" } }]]
        }
    });
});

// Task System: Check if user joined the channel (No Ads)
bot.command('check_task', async (ctx) => {
    const userId = ctx.from.id;
    try {
        const member = await ctx.telegram.getChatMember(TASK_CHANNEL, userId);
        
        if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
            // ইউজারের ডাটাবেসে 0.05 TON যোগ করার কোড এখানে লিখবেন (Firebase)
            ctx.reply('✅ Task Completed! You received 0.05 TON.');
        } else {
            ctx.reply('❌ You have not joined the channel yet. Please join ' + TASK_CHANNEL);
        }
    } catch (error) {
        ctx.reply('Error checking task. Please try again later.');
    }
});

// Admin Panel: Approve Withdrawal
// কমান্ডের ধরন: /approve <user_id> <amount>
bot.command('approve', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return; // অ্যাডমিন ছাড়া কেউ পারবে না

    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply('Usage: /approve <userid> <amount>');

    const userId = args[1];
    const amount = args[2];
    const fee = (amount * 0.05).toFixed(3); // উদাহরণ: ৫% ফি
    const netAmount = (amount - fee).toFixed(3);
    const fakeHash = "c8850f9efae59e6858e4ecf76ac99d7..."; // এখানে রিয়েল ট্রানজেকশন হ্যাশ আসবে

    // ইউজারকে মেসেজ পাঠানো
    const successMsg = `✅ Your withdrawal of ${amount} TON has been processed!\n\nFee: ${fee} TON\nNet Amount: ${netAmount} TON\nTransaction hash: ${fakeHash}`;
    
    bot.telegram.sendMessage(userId, successMsg, {
        reply_markup: { inline_keyboard: [[{ text: "View on TonScan", url: `https://tonscan.org/tx/${fakeHash}` }]] }
    }).then(() => {
        ctx.reply(`✅ Approved message sent to ${userId}`);
    }).catch(err => {
        ctx.reply('Failed to send message. User might have blocked the bot.');
    });
});

// Admin Panel: Reject Withdrawal
// কমান্ডের ধরন: /reject <user_id>
bot.command('reject', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 2) return ctx.reply('Usage: /reject <userid>');

    const userId = args[1];

    // ইউজারকে রিজেক্ট মেসেজ পাঠানো
    const rejectMsg = `❌ Rejected Your Withdraw.\n\nMinimum withdraw amount is required, or your activity was flagged.`;
    
    bot.telegram.sendMessage(userId, rejectMsg).then(() => {
        ctx.reply(`❌ Rejected message sent to ${userId}`);
    });
});

bot.launch();
console.log('Bot is running...');
