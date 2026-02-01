import nodemailer from 'nodemailer';

// Gmail configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = `"Feednances" <${process.env.SMTP_EMAIL}>`;

// Email template base styles
const emailStyles = {
  wrapper: 'background-color: #0a0a0a; padding: 40px 20px;',
  container: 'max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; border: 1px solid #222;',
  header: 'padding: 32px 32px 24px; border-bottom: 1px solid #222;',
  logo: 'font-size: 20px; font-weight: 700; color: #fff; margin: 0; display: flex; align-items: center; gap: 8px;',
  logoIcon: 'width: 28px; height: 28px; background: linear-gradient(135deg, #4ade80, #22c55e); border-radius: 8px; display: inline-block; margin-right: 8px;',
  body: 'padding: 32px;',
  title: 'font-size: 28px; font-weight: 700; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;',
  subtitle: 'font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0; line-height: 1.5;',
  card: 'background-color: #1a1a1a; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #2a2a2a;',
  cardTitle: 'font-size: 14px; color: #71717a; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;',
  cardValue: 'font-size: 32px; font-weight: 700; color: #4ade80; margin: 0;',
  infoRow: 'display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #222;',
  infoLabel: 'font-size: 14px; color: #71717a;',
  infoValue: 'font-size: 14px; color: #ffffff; font-weight: 500;',
  badge: 'display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;',
  badgeSuccess: 'background-color: rgba(74, 222, 128, 0.15); color: #4ade80;',
  badgeWarning: 'background-color: rgba(251, 191, 36, 0.15); color: #fbbf24;',
  footer: 'padding: 24px 32px; background-color: #0d0d0d; border-top: 1px solid #222;',
  footerText: 'font-size: 12px; color: #52525b; margin: 0; text-align: center;',
  footerLink: 'color: #4ade80; text-decoration: none;',
};

function getEmailTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; ${emailStyles.wrapper}">
      <div style="${emailStyles.container}">
        <div style="${emailStyles.header}">
          <p style="${emailStyles.logo}">
            <span style="${emailStyles.logoIcon}"></span>
            Feednances
          </p>
        </div>
        ${content}
        <div style="${emailStyles.footer}">
          <p style="${emailStyles.footerText}">
            © ${new Date().getFullYear()} Feednances Inc. · 
            <a href="#" style="${emailStyles.footerLink}">Privacy</a> · 
            <a href="#" style="${emailStyles.footerLink}">Terms</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendSubscriptionChargedEmail(email: string, name: string, amount: string, nextDate: Date) {
  if (!email) return;

  try {
    console.log(`📨 Sending receipt to ${email} via Gmail...`);
    
    const content = `
      <div style="${emailStyles.body}">
        <span style="${emailStyles.badge} ${emailStyles.badgeSuccess}">✓ Payment confirmed</span>
        <h1 style="${emailStyles.title}; margin-top: 16px;">Payment processed successfully</h1>
        <p style="${emailStyles.subtitle}">Your subscription has been renewed successfully.</p>
        
        <div style="${emailStyles.card}">
          <p style="${emailStyles.cardTitle}">Amount charged</p>
          <p style="${emailStyles.cardValue}">${amount}€</p>
        </div>
        
        <div style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #2a2a2a;">
            <span style="font-size: 14px; color: #71717a;">Service</span>
            <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin: 4px 0 0 0;">${name}</p>
          </div>
          <div style="padding: 16px 20px;">
            <span style="font-size: 14px; color: #71717a;">Next renewal</span>
            <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin: 4px 0 0 0;">📅 ${nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    `;
    
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `✓ Payment processed: ${name}`,
      html: getEmailTemplate(content),
    });
    console.log(`✅ Receipt sent to ${email}`);
  } catch (error) {
    console.error(`❌ SMTP Gmail Error (Charge):`, error);
  }
}


export async function sendUpcomingSubscriptionEmail(email: string, name: string, amount: string, dueDate: Date) {
  if (!email) return;

  try {
    console.log(`📨 Sending notice to ${email} via Gmail...`);

    const content = `
      <div style="${emailStyles.body}">
        <span style="${emailStyles.badge} ${emailStyles.badgeWarning}">⚡ Reminder</span>
        <h1 style="${emailStyles.title}; margin-top: 16px;">Payment due in 2 days</h1>
        <p style="${emailStyles.subtitle}">We're letting you know so you're not caught off guard.</p>
        
        <div style="${emailStyles.card}">
          <p style="${emailStyles.cardTitle}">Amount to be charged</p>
          <p style="${emailStyles.cardValue}">${amount}€</p>
        </div>
        
        <div style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #2a2a2a;">
            <span style="font-size: 14px; color: #71717a;">Service</span>
            <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin: 4px 0 0 0;">${name}</p>
          </div>
          <div style="padding: 16px 20px;">
            <span style="font-size: 14px; color: #71717a;">Due date</span>
            <p style="font-size: 16px; color: #fbbf24; font-weight: 600; margin: 4px 0 0 0;">📅 ${dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div style="background-color: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 12px; padding: 16px; margin-top: 24px;">
          <p style="font-size: 14px; color: #fbbf24; margin: 0;">
            💡 If you do not wish to renew, cancel before ${dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} to avoid charges.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `⚡ Notice: ${name} due in 2 days`,
      html: getEmailTemplate(content),
    });
    console.log(`✅ Notice sent to ${email}`);
  } catch (error) {
    console.error(`❌ SMTP Gmail Error (Notice):`, error);
  }
}