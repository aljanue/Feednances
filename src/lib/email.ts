import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,                  
  secure: false,              
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

const FROM_EMAIL = `"Cashium" <${process.env.SMTP_EMAIL}>`;
export async function sendSubscriptionChargedEmail(email: string, name: string, amount: string, nextDate: Date) {
  if (!email) return;

  try {
    console.log(`📨 Enviando recibo a ${email} vía Outlook...`);
    
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `✅ Pago procesado: ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h1 style="color: #000;">Pago realizado</h1>
          <p>Hola,</p>
          <p>Se ha registrado correctamente el pago de tu suscripción <strong>${name}</strong> por un importe de <strong>${amount}€</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p>📅 Tu próxima renovación será el: <strong>${nextDate.toLocaleDateString()}</strong></p>
          <p style="font-size: 12px; color: #888;">Este es un mensaje automático de eednances.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(`❌ Error SMTP Outlook (Cobro):`, error);
  }
}


export async function sendUpcomingSubscriptionEmail(email: string, name: string, amount: string, dueDate: Date) {
  if (!email) return;

  try {
    console.log(`📨 Enviando aviso a ${email} vía Outlook...`);

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `⚠️ Aviso: ${name} vence en 2 días`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h1 style="color: #d9534f;">Recordatorio de pago</h1>
          <p>Hola,</p>
          <p>Te recordamos que tu suscripción a <strong>${name}</strong> (${amount}€) se renovará automáticamente el día <strong>${dueDate.toLocaleDateString()}</strong>.</p>
          <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; font-size: 14px;">
            Si no deseas renovarla, por favor cancélala antes de esa fecha para evitar cargos.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error(`❌ Error SMTP Outlook (Aviso):`, error);
  }
}