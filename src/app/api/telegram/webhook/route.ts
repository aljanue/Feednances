import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const { text, chat } = update.message;
    const telegramId = chat.id.toString();

    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      
      if (parts.length === 2) {
        const userId = parts[1];

        const user = await db.query.users.findFirst({
          where: eq(users.id, userId)
        });

        if (user) {
          await db.update(users)
            .set({ telegramChatId: telegramId })
            .where(eq(users.id, userId));

          await sendMessage(telegramId, `✅ <b>¡Automatic Linked!</b>\n\nHello ${user.username}, I have configured your notifications correctly.`);
          console.log(`🔗 User ${user.username} linked via Deep Link`);
        } else {
          await sendMessage(telegramId, "❌ Didn't find any account associated with this link.");
        }
      } else {
        await sendMessage(telegramId, "👋 Hello. To link your account, use the button from the App or Shortcut.");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ ok: true });
  }
}