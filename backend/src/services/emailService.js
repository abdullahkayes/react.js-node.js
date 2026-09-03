import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

const getTransporter = () => {
  if (!transporter) {
    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
    transporter = nodemailer.createTransport(config);
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL] (smtp not configured) To: ${to} Subject: ${subject}`);
    return { messageId: 'simulated' };
  }

  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await t.sendMail({ from, to, subject, html });
  return info;
};

const statusChangeTemplate = (trackingNumber, newStatus, note = '') => {
  const statusLabels = {
    pending: 'Pending',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    customs: 'Customs Clearance',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  };

  const label = statusLabels[newStatus] || newStatus;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Shipping Status Update</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2563eb;">Dazzling Shipping</h2>
    <p>Your shipment status has been updated.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tracking Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${trackingNumber}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>New Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${label}</td></tr>
      ${note ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Note</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${note}</td></tr>` : ''}
    </table>
    <p>Track your shipment anytime at your convenience.</p>
    <p style="margin-top: 30px; color: #999; font-size: 12px;">Dazzling Shipping - International Shipping Platform</p>
  </div>
</body>
</html>
  `;
};

export { sendEmail, statusChangeTemplate };
export default getTransporter;
