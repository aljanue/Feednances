import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserTelegramChatId } from "@/lib/data/users.queries";
import { sendMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const { text, chat } = update.message;
    const telegramId = chat.id.toString();

    if (text.startsWith("/start")) {
      const parts = text.split(" ");

      if (parts.length === 2) {
        const userId = parts[1];

        const user = await getUserById(userId);

        if (user) {
          await sendMessage(
            telegramId,
            `🤖 <b>Welcome to Feednances Bot!</b>\n\nI'm your personal assistant for subscription control. My mission is to ensure you never miss a payment:\n\n🔔 I'll notify you 2 days before each renewal.\n✅ I'll confirm once a payment is recorded in our system.`,
          );

          await updateUserTelegramChatId(userId, telegramId);

          await sendMessage(
            telegramId,
            `🔗 <b>Automatic Linked!</b>\n\nHello ${user.username}, I have configured your notifications correctly.`,
          );

          await sendMessage(
            telegramId,
            `🚀 <b>Next Step:</b>\nTo add expenses and subscriptions in seconds, install the main iOS Shortcut.\n\n👇 <b>Download here:</b>\n<a href="https://www.icloud.com/shortcuts/e7560ae3d4804005bab592f33a4b1d31">📲 Install Feednances App</a>`,
          );
        } else {
          await sendMessage(
            telegramId,
            "❌ Didn't find any account associated with this link.",
          );
        }
      } else {
        await sendMessage(
          telegramId,
          "👋 Hello. To link your account, use the button from the App or Shortcut.",
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: true });
  }
}
