const { Telegraf, Markup } = require('telegraf');
// Apnar Bot Token r Admin ID ekhane diben
const bot = new Telegraf('7956497373:AAFdqSrJkFywUlIxKbll25aZkg3e6tURfpE');
const ADMIN_ID = '8514470262'; // Admin er Telegram User ID

// Real Task Check (API diye Channel e join ache kina)
async function checkMembership(ctx, channelUsername) {
    try {
        const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);
        return ['creator', 'administrator', 'member'].includes(member.status);
    } catch (e) {
        return false;
    }
}

// /start command
bot.start((ctx) => {
    ctx.reply(
        "Welcome to the Moon Premium Bot! 🌕\nComplete tasks, upgrade plans, and earn TON.",
        Markup.inlineKeyboard([
            [Markup.button.webApp("🌕 Open App", "https://t.me/PlanTonAppbot/app")]
        ])
    );
});

// Admin Command: Approve Withdrawal
// Example: /approve 123456789 5.5 EQB...x4z
bot.command('approve', (ctx) => {
    if (ctx.from.id.toString() !== ADMIN_ID) return ctx.reply("⛔ Admin only.");
    
    const args = ctx.message.text.split(' ');
    if (args.length < 4) return ctx.reply("Format: /approve [UserID] [Amount] [Wallet]");

    const userId = args[1];
    const amount = args[2];
    const wallet = args[3];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const msg = `🎊 **Withdrawal Successful!** 🎊\n\n` +
                `✅ **Congratulations!**\n` +
                `Your withdrawal request has been **APPROVED**.\n\n` +
                `💰 **Amount:** ${amount} TON\n` +
                `👛 **Wallet Address:** ${wallet}\n` +
                `⏰ **Time:** ${currentTime}\n` +
                `📜 **Status:** Sent to your wallet\n\n` +
                `Thank you for being with **Plant Ton Pro**! 🌿`;

    bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' })
        .then(() => ctx.reply(`✅ Approval message sent to ${userId}`))
        .catch(err => ctx.reply(`❌ Failed to send: ${err.message}`));
});

// Admin Command: Reject Withdrawal
// Example: /reject 123456789 5.5 EQB...x4z
bot.command('reject', (ctx) => {
    if (ctx.from.id.toString() !== ADMIN_ID) return ctx.reply("⛔ Admin only.");
    
    const args = ctx.message.text.split(' ');
    if (args.length < 4) return ctx.reply("Format: /reject [UserID] [Amount] [Wallet]");

    const userId = args[1];
    const amount = args[2];
    const wallet = args[3];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('en-US');

    const msg = `⚠️ **Withdrawal Notice** ⚠️\n\n` +
                `❌ **Transaction Rejected**\n` +
                `We're sorry! Your withdrawal request has been **REJECTED**.\n\n` +
                `💰 **Amount:** ${amount} TON\n` +
                `👛 **Target Wallet:** ${wallet}\n` +
                `⏰ **Time:** ${currentTime}\n` +
                `📅 **Date:** ${currentDate}\n\n` +
                `📌 **Reason:** Insufficient minimum balance or security verification failed. Please ensure you have reached the withdrawal limit.\n\n` +
                `💡 **What to do?**\n` +
                `Check your balance and try again. If you have any questions, contact our **Support Group**.\n\n` +
                `🌿 Keep planting to earn more!`;

    bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' })
        .then(() => ctx.reply(`❌ Rejection message sent to ${userId}`))
        .catch(err => ctx.reply(`❌ Failed to send: ${err.message}`));
});

bot.launch();
