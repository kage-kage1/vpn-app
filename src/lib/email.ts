import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVPNCredentialsEmail(
  customerEmail: string,
  vpnCredentials: any,
  orderDetails: any
) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@kagevpn.com',
    to: customerEmail,
    subject: 'သင့် VPN Account အသေးစိတ်များ - Kage VPN Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00d4ff;">သင့် VPN Account အသေးစিတ်များ</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>VPN Login အချက်အလက်များ:</h3>
          <p><strong>Username:</strong> ${vpnCredentials.username}</p>
          <p><strong>Password:</strong> ${vpnCredentials.password}</p>
          <p><strong>Server Info:</strong> ${vpnCredentials.serverInfo}</p>
          <p><strong>Expiry Date:</strong> ${vpnCredentials.expiryDate}</p>
        </div>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>အရေးကြီးသော သတိပေးချက်များ:</h4>
          <ul>
            <li>သင့် VPN credentials များကို လုံခြုံစွာ သိမ်းဆည်းပါ</li>
            <li>အခြားသူများနှင့် မျှဝေခြင်း မပြုပါနှင့်</li>
            <li>ပြဿနာရှိပါက ကျွန်တော်တို့ကို ဆက်သွယ်ပါ</li>
          </ul>
        </div>
        
        <p>ကျေးဇူးတင်ပါတယ်,<br>Kage VPN Store Team</p>
        <p>Telegram: @kagevpn | Email: info@kagevpn.com</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('VPN credentials email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderDetails: any
) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@kagevpn.com',
    to: customerEmail,
    subject: 'Order Confirmation - Kage VPN Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00d4ff;">Order Confirmation</h2>
        
        <p>သင့် order ကို လက်ခံရရှိပါတယ်။</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ${orderDetails.total} Ks</p>
          <p><strong>Status:</strong> Payment Verification စစ်ဆေးနေပါတယ်</p>
        </div>
        
        <p>Payment verification ပြီးရင် VPN credentials များကို ပို့ပေးပါမယ်။</p>
        
        <p>ကျေးဇူးတင်ပါတယ်,<br>Kage VPN Store Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}