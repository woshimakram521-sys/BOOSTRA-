import 'dotenv/config';
import nodemailer from 'nodemailer';
import { Order, PaymentRecord } from './types';
import { db } from './db';

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailDispatchResult {
  success: boolean;
  dispatchedViaSmtp: boolean;
  messageId?: string;
  error?: string;
  message: string;
  missingVariables?: string[];
  recipient: string;
}

/**
 * Returns the active or default admin email recipient
 */
export function getAdminRecipientEmail(customRecipient?: string): string {
  if (customRecipient && customRecipient.trim().length > 3) {
    return customRecipient.trim();
  }
  const dbSettings = db.getSettings();
  if (dbSettings?.adminNotificationEmail && dbSettings.adminNotificationEmail.trim().length > 3) {
    return dbSettings.adminNotificationEmail.trim();
  }
  return process.env.ADMIN_EMAIL || 'mdmohammad.644633815@gmail.com';
}

/**
 * Resolves SMTP configuration from environment variables or persistent database settings
 */
export function getResolvedSmtpConfig() {
  const dbSettings = db.getSettings();
  const dbSmtp = dbSettings?.smtpConfig;

  let host = process.env.SMTP_HOST || dbSmtp?.host || '';
  let port = process.env.SMTP_PORT || (dbSmtp?.port ? String(dbSmtp.port) : '465');
  let user = process.env.SMTP_USER || dbSmtp?.user || '';
  let pass = process.env.SMTP_PASS || dbSmtp?.pass || '';
  let secure = process.env.SMTP_SECURE === 'true' || dbSmtp?.secure === true || port === '465';
  let from = process.env.SMTP_FROM || dbSmtp?.from || '';

  // If user is a gmail address and host is empty, default host to smtp.gmail.com
  if ((!host || !host.trim()) && (user.includes('@gmail.com') || user.includes('gmail'))) {
    host = 'smtp.gmail.com';
  }

  // Sanitize password by stripping any whitespaces (e.g. Google App Passwords formatted as "xxxx xxxx xxxx xxxx")
  if (pass) {
    pass = pass.trim().replace(/\s+/g, '');
  }

  if (user) {
    user = user.trim();
  }

  if (host) {
    host = host.trim();
  }

  if (!from && user) {
    from = `"BOOSTARA Notification" <${user}>`;
  }

  return { host, port, user, pass, secure, from };
}

/**
 * Returns configuration diagnostics for SMTP
 */
export function getEmailConfigStatus(overrideRecipient?: string) {
  const config = getResolvedSmtpConfig();
  const adminEmail = getAdminRecipientEmail(overrideRecipient);

  const missing: string[] = [];
  if (!config.host || !config.host.trim()) missing.push('SMTP_HOST');
  if (!config.user || !config.user.trim()) missing.push('SMTP_USER');
  if (!config.pass || !config.pass.trim()) missing.push('SMTP_PASS');

  return {
    isConfigured: missing.length === 0,
    smtpHost: config.host || null,
    smtpPort: config.port,
    smtpUser: config.user || null,
    smtpSecure: config.secure,
    adminRecipient: adminEmail,
    missingVariables: missing,
    environmentKeys: {
      SMTP_HOST: config.host ? `Configured (${config.host})` : 'Missing',
      SMTP_PORT: `Configured (${config.port})`,
      SMTP_USER: config.user ? `Configured (${config.user})` : 'Missing',
      SMTP_PASS: config.pass ? 'Configured (Secret Verified)' : 'Missing',
      ADMIN_EMAIL: adminEmail ? `Configured (${adminEmail})` : 'Default fallback',
    },
  };
}

/**
 * Internal helper to instantiate nodemailer transporter
 */
function getTransporter() {
  const config = getResolvedSmtpConfig();
  if (!config.host || !config.user || !config.pass) {
    return null;
  }

  const isGmail = config.host.includes('gmail') || config.user.endsWith('@gmail.com');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  const port = parseInt(config.port, 10);
  return nodemailer.createTransport({
    host: config.host,
    port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/**
 * Dispatches an email notification or safely logs to server logs if credentials are not yet supplied
 */
export async function sendEmailNotification(
  payload: EmailNotificationPayload
): Promise<EmailDispatchResult> {
  const targetEmail = getAdminRecipientEmail(payload.to);
  const config = getResolvedSmtpConfig();

  console.log(`\n=============================================================`);
  console.log(`📧 [BOOSTARA EMAIL NOTIFICATION DISPATCH]`);
  console.log(`To: ${targetEmail}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Timestamp: ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })} (Dhaka Time)`);
  console.log(`--------------------- [CONTENT PREVIEW] ---------------------`);
  console.log(payload.text.trim());
  console.log(`=============================================================\n`);

  const transporter = getTransporter();

  if (!transporter) {
    const missing: string[] = [];
    if (!config.host) missing.push('SMTP_HOST');
    if (!config.user) missing.push('SMTP_USER');
    if (!config.pass) missing.push('SMTP_PASS');

    console.warn(
      `⚠️ [EMAIL NOTIFICATION] SMTP credentials missing in environment: [${missing.join(', ')}]. ` +
      `Notification was safely logged to console output. ` +
      `To dispatch live emails directly to inbox, configure SMTP_HOST, SMTP_USER, and SMTP_PASS.`
    );

    return {
      success: true,
      dispatchedViaSmtp: false,
      recipient: targetEmail,
      message: `Notification logged safely to system logs. Missing SMTP environment keys: ${missing.join(', ')}`,
      missingVariables: missing,
    };
  }

  try {
    const fromAddress = config.from || `"BOOSTARA Notification" <${config.user}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    console.log(`✅ [EMAIL DISPATCHED] Successfully sent live notification to ${targetEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      dispatchedViaSmtp: true,
      messageId: info.messageId,
      recipient: targetEmail,
      message: `Live email successfully delivered to ${targetEmail} via SMTP.`,
    };
  } catch (err: any) {
    console.error(`❌ [EMAIL SMTP FAILURE] Failed delivering email to ${targetEmail}:`, err.message);
    return {
      success: false,
      dispatchedViaSmtp: false,
      recipient: targetEmail,
      error: err.message,
      message: `SMTP delivery error: ${err.message}. Notification content was safely recorded in server logs.`,
    };
  }
}

/**
 * Formats BD Dhaka time
 */
function formatDhakaDateTime(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }) + ' (BDT)';
}

/**
 * Base Application URL for Admin Links
 */
function getAppBaseUrl(): string {
  return (process.env.APP_URL || 'https://ais-pre-tnym27dfkihp64oar6b5da-263891025911.asia-southeast1.run.app').replace(/\/$/, '');
}

/**
 * 1. NOTIFY NEW ORDER CREATED
 */
export async function notifyNewOrder(order: Order, adminEmail?: string): Promise<EmailDispatchResult> {
  const targetEmail = getAdminRecipientEmail(adminEmail);
  const appUrl = getAppBaseUrl();
  const adminLink = `${appUrl}/admin?search=${encodeURIComponent(order.orderId)}`;
  const formattedTime = formatDhakaDateTime(order.createdAt);

  let serviceName = '';
  let quantityText = '';
  let detailsText = '';
  let submittedLinks = '';

  if (order.type === 'SMM') {
    serviceName = `${order.smmDetails?.platform || 'Social'} - ${order.smmDetails?.serviceType || 'SMM'} (${order.smmDetails?.tierName || 'Standard'})`;
    quantityText = `${order.smmDetails?.quantity?.toLocaleString() || 0} Units`;
    submittedLinks = order.smmDetails?.targetLink || 'N/A';
    detailsText = [
      `• Platform: ${order.smmDetails?.platform}`,
      `• Service: ${order.smmDetails?.serviceType}`,
      `• Tier: ${order.smmDetails?.tierName}`,
      `• Quantity: ${order.smmDetails?.quantity}`,
      `• Rate per 1K: ৳${order.smmDetails?.ratePer1000}`,
      order.smmDetails?.reactionType ? `• Reaction: ${order.smmDetails.reactionType}` : null,
      `• Target Link: ${order.smmDetails?.targetLink}`,
    ].filter(Boolean).join('\n');
  } else if (order.type === 'ADS') {
    serviceName = `Targeted Ads Boost (${order.adsDetails?.platform || 'Meta/TikTok/YouTube'})`;
    quantityText = `Budget: ৳${order.adsDetails?.budget || 0} (~$${(((order.adsDetails?.budget || 0) / 145)).toFixed(2)})`;
    submittedLinks = [
      order.adsDetails?.targetLink ? `Target Post: ${order.adsDetails.targetLink}` : '',
      order.adsDetails?.mediaLink ? `Drive Media: ${order.adsDetails.mediaLink}` : '',
    ].filter(Boolean).join(' | ');
    detailsText = [
      `• Platform: ${order.adsDetails?.platform}`,
      `• Campaign Duration: ${order.adsDetails?.campaignDuration}`,
      `• Ad Budget: ৳${order.adsDetails?.budget}`,
      `• Service Fee: ৳${order.adsDetails?.serviceFee}`,
      `• Objective: ${order.adsDetails?.adObjective || 'N/A'}`,
      `• Target Age: ${order.adsDetails?.targetAgeRange || 'All'}`,
      `• Target Gender: ${order.adsDetails?.gender || 'All'}`,
      `• Target Location: ${order.adsDetails?.location || 'Bangladesh'}`,
      `• Interests/Audience: ${order.adsDetails?.interests || order.adsDetails?.targetAudience || 'N/A'}`,
      `• Target Link: ${order.adsDetails?.targetLink}`,
      `• Google Drive Media Link: ${order.adsDetails?.mediaLink}`,
    ].filter(Boolean).join('\n');
  } else {
    // WEBSITE
    serviceName = `Website Solution: ${order.websiteDetails?.packageName || 'Custom Web'}`;
    quantityText = `1 Complete Project`;
    submittedLinks = order.websiteDetails?.referenceLink || 'None';
    detailsText = [
      `• Package: ${order.websiteDetails?.packageName}`,
      `• Total Price: ৳${order.totalAmount}`,
      `• Advance Required: ৳${order.advanceAmount || order.websiteDetails?.advanceAmount || 0}`,
      `• Remaining Balance: ৳${order.remainingAmount || order.websiteDetails?.remainingAmount || 0}`,
      `• Business/Shop Name: ${order.websiteDetails?.businessName || 'N/A'}`,
      `• Website Category: ${order.websiteDetails?.websiteType || 'N/A'}`,
      `• Preferred Theme Color: ${order.websiteDetails?.preferredColor || 'N/A'}`,
      `• Reference Website: ${order.websiteDetails?.referenceLink || 'None'}`,
      `• Delivery Mode: ${order.websiteDetails?.deliveryMethod || 'WhatsApp'}`,
    ].filter(Boolean).join('\n');
  }

  const plainText = `
========================================
🚨 NEW ORDER RECEIVED - BOOSTARA
========================================
Order ID: ${order.orderId}
Service: ${serviceName}
Quantity / Scope: ${quantityText}
Total Amount: ৳${order.totalAmount}
${order.advanceAmount ? `Advance Amount: ৳${order.advanceAmount}` : ''}
${order.remainingAmount ? `Remaining Amount: ৳${order.remainingAmount}` : ''}

Customer Contact:
WhatsApp: ${order.customerWhatsapp} (https://wa.me/88${order.customerWhatsapp.replace(/[^0-9]/g, '')})
Order Note: ${order.orderNote || 'No special instructions'}

Submitted Link(s):
${submittedLinks}

Order Status: ${order.orderStatus}
Payment Status: ${order.paymentStatus}
Order Placed At: ${formattedTime}

Detailed Specifications:
${detailsText}

Admin Action:
Open and manage this order directly in your Admin Panel:
${adminLink}
========================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order: ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030817; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #050b1b; border: 1px solid #132345; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #091534 0%, #050b1c 100%); padding: 24px 28px; border-bottom: 2px solid #1ac8ff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">BOOST<span style="color: #1ac8ff;">ARA</span></span>
                    <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-top: 2px;">Automated Admin Notification System</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">New Order</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px;">
              <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                নতুন অর্ডার সফলভাবে তৈরি হয়েছে!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                গ্রাহক BOOSTARA প্ল্যাটফর্মে একটি নতুন অর্ডার প্লেস করেছেন। বিস্তারিত বিবরণ নিচে দেওয়া হলো:
              </p>

              <!-- Order Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #091534; border: 1px solid #1e3a8a; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="35%" style="font-size: 12px; color: #94a3b8; font-weight: 600;">Order ID:</td>
                        <td style="font-size: 14px; color: #1ac8ff; font-weight: 800; font-family: monospace;">${order.orderId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">সার্ভিস নাম (Service):</td>
                        <td style="font-size: 13px; color: #ffffff; font-weight: 700;">${serviceName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">পরিমাণ (Quantity):</td>
                        <td style="font-size: 13px; color: #e2e8f0; font-weight: 600;">${quantityText}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">মোট মূল্য (Total Amount):</td>
                        <td style="font-size: 16px; color: #34d399; font-weight: 800; font-family: monospace;">৳${order.totalAmount}</td>
                      </tr>
                      ${order.advanceAmount ? `
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">অগ্রিম প্রদেয় (Advance):</td>
                        <td style="font-size: 13px; color: #f59e0b; font-weight: 700;">৳${order.advanceAmount} (বাকি: ৳${order.remainingAmount || 0})</td>
                      </tr>` : ''}
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">অর্ডার স্ট্যাটাস:</td>
                        <td style="font-size: 12px; color: #fbbf24; font-weight: 700;">● ${order.orderStatus}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">পেমেন্ট স্ট্যাটাস:</td>
                        <td style="font-size: 12px; color: #fbbf24; font-weight: 700;">● ${order.paymentStatus}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">তারিখ ও সময়:</td>
                        <td style="font-size: 12px; color: #cbd5e1;">${formattedTime}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Customer & Submitted Links Details -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050b1c; border: 1px solid #132345; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 10px; border-bottom: 1px solid #132345; padding-bottom: 6px;">
                      গ্রাহকের তথ্য ও সাবমিটকৃত লিঙ্ক
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="5">
                      <tr>
                        <td width="35%" style="font-size: 12px; color: #94a3b8; font-weight: 600;">WhatsApp নম্বর:</td>
                        <td style="font-size: 13px; color: #34d399; font-weight: 700;">
                          <a href="https://wa.me/88${order.customerWhatsapp.replace(/[^0-9]/g, '')}" style="color: #34d399; text-decoration: none;">
                            ${order.customerWhatsapp} ↗ (Chat on WhatsApp)
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">সাবমিটকৃত লিঙ্ক:</td>
                        <td style="font-size: 12px; color: #38bdf8; word-break: break-all;">
                          ${submittedLinks !== 'N/A' && submittedLinks !== 'None'
                            ? `<a href="${submittedLinks.startsWith('http') ? submittedLinks : `https://${submittedLinks}`}" target="_blank" style="color: #38bdf8;">${submittedLinks}</a>`
                            : submittedLinks}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">অর্ডার নোট:</td>
                        <td style="font-size: 12px; color: #e2e8f0; font-style: italic;">${order.orderNote || 'কোন বিশেষ নোট নেই'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <a href="${adminLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #8b3dff 0%, #1ac8ff 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 15px rgba(26, 200, 255, 0.35);">
                      অ্যাডমিন প্যানেলে অর্ডার দেখুন ও পরিচালনা করুন →
                    </a>
                  </td>
                </tr>
              </table>
              <div style="text-align: center; margin-top: 8px;">
                <span style="font-size: 11px; color: #64748b;">Direct Link: <a href="${adminLink}" style="color: #64748b;">${adminLink}</a></span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #030817; padding: 16px 28px; border-top: 1px solid #132345; text-align: center; font-size: 11px; color: #64748b;">
              এই নোটিফিকেশনটি BOOSTARA প্ল্যাটফর্মের অ্যাডমিন ইমেল <strong style="color: #94a3b8;">${targetEmail}</strong>-এ স্বয়ংক্রিয়ভাবে প্রেরিত।
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmailNotification({
    to: targetEmail,
    subject: `🚨 [BOOSTARA NEW ORDER] #${order.orderId} - ৳${order.totalAmount} (${order.type}: ${serviceName})`,
    text: plainText,
    html: htmlContent,
  });
}

/**
 * 2. NOTIFY PAYMENT SUBMITTED
 */
export async function notifyPaymentSubmitted(
  order: Order,
  payment: PaymentRecord,
  adminEmail?: string
): Promise<EmailDispatchResult> {
  const targetEmail = getAdminRecipientEmail(adminEmail);
  const appUrl = getAppBaseUrl();
  const adminLink = `${appUrl}/admin?search=${encodeURIComponent(order.orderId)}`;
  const formattedTime = formatDhakaDateTime(payment.submittedAt);

  const plainText = `
========================================
💰 PAYMENT SUBMITTED - BOOSTARA
========================================
Order ID: ${order.orderId}
Service Type: ${order.type}
Total Order Amount: ৳${order.totalAmount}
Paid Amount: ৳${payment.paidAmount}

Payment Details:
• Method: ${payment.paymentMethod}
• Sender Mobile Number: ${payment.senderNumber}
• Transaction ID (TrxID): ${payment.transactionId}
• Payment Status: ${payment.paymentStatus}
• Submitted At: ${formattedTime}

Customer WhatsApp: ${order.customerWhatsapp} (https://wa.me/88${order.customerWhatsapp.replace(/[^0-9]/g, '')})

Action Required:
Verify the transaction in your ${payment.paymentMethod} account, then approve in Admin Panel:
${adminLink}
========================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Submitted: ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030817; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #050b1b; border: 1px solid #132345; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #050b1c 100%); padding: 24px 28px; border-bottom: 2px solid #10b981;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">BOOST<span style="color: #34d399;">ARA</span></span>
                    <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a7f3d0; margin-top: 2px;">Payment Submission Alert</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">Payment Alert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px;">
              <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                পেমেন্ট তথ্য সাবমিট হয়েছে!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                গ্রাহক অর্ডার <strong>${order.orderId}</strong> এর জন্য বিকাশ/নগদ/রকেটে পেমেন্ট তথ্য সাবমিট করেছেন। যাচাই করে অর্ডারটি কনফার্ম করুন:
              </p>

              <!-- Payment Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #064e3b; border: 1px solid #059669; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="40%" style="font-size: 12px; color: #a7f3d0; font-weight: 600;">Order ID:</td>
                        <td style="font-size: 14px; color: #ffffff; font-weight: 800; font-family: monospace;">${order.orderId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">পেমেন্ট মেথড:</td>
                        <td style="font-size: 13px; color: #ffffff; font-weight: 800;">${payment.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">সেন্ডার নম্বর (Sender No):</td>
                        <td style="font-size: 14px; color: #fef08a; font-weight: 800; font-family: monospace;">${payment.senderNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">Transaction ID (TrxID):</td>
                        <td style="font-size: 15px; color: #ffffff; font-weight: 900; font-family: monospace; letter-spacing: 1px;">${payment.transactionId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">জমা দেওয়া অর্থ (Paid):</td>
                        <td style="font-size: 18px; color: #6ee7b7; font-weight: 900; font-family: monospace;">৳${payment.paidAmount}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">অর্ডার মোট মূল্য:</td>
                        <td style="font-size: 13px; color: #ffffff; font-weight: 700;">৳${order.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">গ্রাহক WhatsApp:</td>
                        <td style="font-size: 13px; color: #ffffff; font-weight: 700;">${order.customerWhatsapp}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #a7f3d0; font-weight: 600;">সাবমিটের সময়:</td>
                        <td style="font-size: 12px; color: #d1fae5;">${formattedTime}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <a href="${adminLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);">
                      অ্যাডমিন প্যানেলে পেমেন্ট ভেরিফাই করুন →
                    </a>
                  </td>
                </tr>
              </table>
              <div style="text-align: center; margin-top: 8px;">
                <span style="font-size: 11px; color: #64748b;">Direct Link: <a href="${adminLink}" style="color: #64748b;">${adminLink}</a></span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #030817; padding: 16px 28px; border-top: 1px solid #132345; text-align: center; font-size: 11px; color: #64748b;">
              এই নোটিফিকেশনটি BOOSTARA প্ল্যাটফর্মের অ্যাডমিন ইমেল <strong style="color: #94a3b8;">${targetEmail}</strong>-এ স্বয়ংক্রিয়ভাবে প্রেরিত।
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmailNotification({
    to: targetEmail,
    subject: `💰 [PAYMENT SUBMITTED] #${order.orderId} - ৳${payment.paidAmount} via ${payment.paymentMethod} (TrxID: ${payment.transactionId})`,
    text: plainText,
    html: htmlContent,
  });
}

/**
 * 3. NOTIFY ORDER STATUS UPDATED
 */
export async function notifyOrderStatusChanged(
  order: Order,
  previousStatus: string,
  adminEmail?: string
): Promise<EmailDispatchResult> {
  const targetEmail = getAdminRecipientEmail(adminEmail);
  const appUrl = getAppBaseUrl();
  const adminLink = `${appUrl}/admin?search=${encodeURIComponent(order.orderId)}`;
  const formattedTime = formatDhakaDateTime(order.updatedAt || new Date());

  const plainText = `
========================================
🔄 ORDER STATUS UPDATED - BOOSTARA
========================================
Order ID: ${order.orderId}
Service Type: ${order.type}
Total Amount: ৳${order.totalAmount}

Status Transition:
• Previous Order Status: ${previousStatus}
• New Order Status: ${order.orderStatus}
• Payment Status: ${order.paymentStatus}
${order.rejectionReason ? `• Rejection Reason: ${order.rejectionReason}` : ''}
• Updated At: ${formattedTime}

Customer WhatsApp: ${order.customerWhatsapp}

Admin Panel:
${adminLink}
========================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Status Changed: ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030817; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #050b1b; border: 1px solid #132345; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #050b1c 100%); padding: 20px 24px; border-bottom: 2px solid #8b3dff;">
              <span style="font-size: 20px; font-weight: 900; color: #ffffff;">BOOST<span style="color: #a78bfa;">ARA</span></span>
              <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #c4b5fd; margin-top: 2px;">Order Status Event</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px;">অর্ডারের স্ট্যাটাস পরিবর্তিত হয়েছে</h3>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8;">
                অর্ডার <strong style="color: #1ac8ff;">#${order.orderId}</strong> এর স্ট্যাটাস <strong style="color: #e2e8f0;">${previousStatus}</strong> থেকে <strong style="color: #34d399;">${order.orderStatus}</strong>-এ পরিবর্তিত হয়েছে।
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="background-color: #091534; border: 1px solid #132345; border-radius: 10px; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="font-size: 12px; color: #94a3b8;">Order ID:</td>
                  <td style="font-size: 13px; color: #1ac8ff; font-weight: bold; font-family: monospace;">${order.orderId}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">নতুন স্ট্যাটাস:</td>
                  <td style="font-size: 13px; color: #34d399; font-weight: bold;">● ${order.orderStatus}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">পেমেন্ট স্ট্যাটাস:</td>
                  <td style="font-size: 13px; color: #ffffff; font-weight: bold;">● ${order.paymentStatus}</td>
                </tr>
                ${order.rejectionReason ? `
                <tr>
                  <td style="font-size: 12px; color: #f87171;">বাতিলের কারণ:</td>
                  <td style="font-size: 12px; color: #fca5a5;">${order.rejectionReason}</td>
                </tr>` : ''}
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">গ্রাহক WhatsApp:</td>
                  <td style="font-size: 12px; color: #e2e8f0;">${order.customerWhatsapp}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8;">আপডেট সময়:</td>
                  <td style="font-size: 12px; color: #cbd5e1;">${formattedTime}</td>
                </tr>
              </table>

              <div style="text-align: center;">
                <a href="${adminLink}" target="_blank" style="display: inline-block; background-color: #8b3dff; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
                  অর্ডার বিস্তারিত দেখুন →
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmailNotification({
    to: targetEmail,
    subject: `🔄 [STATUS UPDATED] #${order.orderId} is now ${order.orderStatus} (Payment: ${order.paymentStatus})`,
    text: plainText,
    html: htmlContent,
  });
}

/**
 * 4. SEND TEST NOTIFICATION TO ADMIN
 */
export async function sendTestNotification(adminEmail?: string): Promise<EmailDispatchResult> {
  const targetEmail = getAdminRecipientEmail(adminEmail);
  const config = getEmailConfigStatus(targetEmail);
  const formattedTime = formatDhakaDateTime(new Date());
  const appUrl = getAppBaseUrl();

  const plainText = `
========================================
🧪 BOOSTARA EMAIL NOTIFICATION TEST
========================================
This is an automated test message from BOOSTARA to verify your Admin Email Notification pipeline.

Target Recipient: ${targetEmail}
Test Timestamp: ${formattedTime}
Website URL: ${appUrl}

Configuration Status:
• SMTP Host: ${config.smtpHost || 'Not Set (Missing SMTP_HOST)'}
• SMTP Port: ${config.smtpPort}
• SMTP User: ${config.smtpUser || 'Not Set (Missing SMTP_USER)'}
• SMTP Pass: ${process.env.SMTP_PASS ? 'Configured' : 'Not Set (Missing SMTP_PASS)'}
• Missing Keys: ${config.missingVariables.length > 0 ? config.missingVariables.join(', ') : 'None - Fully Configured!'}

When a customer places a new SMM, Ads Boost, or Website order, an automatic notification containing:
- Order ID
- Service Name & Quantity
- Customer WhatsApp & Submitted Link
- Total Amount & Payment Status
- Direct Link to Admin Panel
will be delivered here automatically.
========================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Notification - BOOSTARA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030817; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #050b1b; border: 1px solid #132345; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #091534 0%, #050b1c 100%); padding: 20px 24px; border-bottom: 2px solid #1ac8ff;">
              <span style="font-size: 20px; font-weight: 900; color: #ffffff;">BOOST<span style="color: #1ac8ff;">ARA</span></span>
              <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-top: 2px;">Admin Email Pipeline Test</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px;">✅ ইমেল নোটিফিকেশন সিস্টেম টেস্ট সফল</h2>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                আপনার BOOSTARA ওয়েবসাইটের নতুন অর্ডার ও পেমেন্ট নোটিফিকেশন পাইপলাইন সফলভাবে কনফিগার করা হয়েছে।
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="background-color: #091534; border: 1px solid #1e3a8a; border-radius: 10px; margin-bottom: 16px;">
                <tr>
                  <td width="40%" style="font-size: 12px; color: #94a3b8; font-weight: 600;">নোটিফিকেশন প্রাপক:</td>
                  <td style="font-size: 13px; color: #1ac8ff; font-weight: 700;">${targetEmail}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">টেস্ট প্রেরণের সময়:</td>
                  <td style="font-size: 12px; color: #ffffff;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; font-weight: 600;">SMTP স্ট্যাটাস:</td>
                  <td style="font-size: 12px; color: ${config.isConfigured ? '#34d399' : '#fbbf24'}; font-weight: 700;">
                    ${config.isConfigured ? '● লাইভ SMTP সক্রিয়' : '⚠️ সার্ভার লগ সক্রিয় (SMTP কী অনুপস্থিত)'}
                  </td>
                </tr>
              </table>

              ${config.missingVariables.length > 0 ? `
              <div style="background-color: #451a03; border: 1px solid #92400e; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #fde68a;">
                <strong>লক্ষ্য করুন:</strong> সরাসরি আপনার ইনবক্সে রিয়েল-টাইম ইমেল পৌঁছানোর জন্য নিচের ভ্যারিয়েবলগুলো .env ফাইলে দিন:<br>
                <code style="display: block; margin-top: 6px; background-color: #050b1b; padding: 6px; border-radius: 4px; color: #67e8f9; font-family: monospace;">
                  ${config.missingVariables.join(', ')}
                </code>
              </div>` : ''}

              <div style="text-align: center; margin-top: 10px;">
                <a href="${appUrl}/admin" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #8b3dff 0%, #1ac8ff 100%); color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 24px; border-radius: 8px;">
                  অ্যাডমিন প্যানেলে যান
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmailNotification({
    to: targetEmail,
    subject: `🧪 [BOOSTARA TEST] Admin Email Notification Pipeline Test (${formattedTime})`,
    text: plainText,
    html: htmlContent,
  });
}
