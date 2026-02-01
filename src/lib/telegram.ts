const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// 🎨 DESIGN SYSTEM
const STYLE = {
  header: '💎 <b>Feednances</b>',
  separator: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
  badgeSuccess: '✅ <b>PAYMENT CONFIRMED</b>',
  badgeWarning: '⚠️ <b>PAYMENT REMINDER</b>',
  iconMoney: '💎',
  iconCalendar: '📅',
  indent: '   ', 
};

/**
 * Core send function
 */
async function sendMessage(chatId: string, text: string) {
  if (!BOT_TOKEN || !chatId) {
    console.error("❌ Missing Telegram credentials");
    return;
  }

  try {
    await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      }),
    });
    console.log(`✅ Telegram message sent to ${chatId}`);
  } catch (error) {
    console.error('❌ Telegram Network Error:', error);
  }
}

/**
 * NOTIFICATION 1: Charge Confirmed
 */
export async function sendSubscriptionChargedNotification(
  chatId: string | null, 
  name: string, 
  amount: string, 
  nextDate: Date
) {
  if (!chatId) return;

  // Format date to English (e.g., "Feb 20")
  const dateStr = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const message = `
${STYLE.header}
${STYLE.separator}

${STYLE.badgeSuccess}

Your subscription payment has been successfully processed.

<b>${name}</b>
${STYLE.indent}👉 <code>${amount}€</code>

${STYLE.separator}
${STYLE.iconCalendar} Next renewal: <b>${dateStr}</b>
`;

  await sendMessage(chatId, message);
}

/**
 * NOTIFICATION 2: Upcoming Payment
 */
export async function sendUpcomingSubscriptionNotification(
  chatId: string | null, 
  name: string, 
  amount: string, 
  dueDate: Date
) {
  if (!chatId) return;

  const dateStr = dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  const message = `
${STYLE.header}
${STYLE.separator}

${STYLE.badgeWarning}

Your subscription is due in <b>2 days</b>.

<b>${name}</b>
${STYLE.indent}👉 <code>${amount}€</code>

${STYLE.iconCalendar} Due date: <b>${dateStr}</b>

${STYLE.separator}
<i>💡 If you do not wish to renew, please cancel before this date to avoid charges.</i>
`;

  await sendMessage(chatId, message);
}