import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, certificateNumber, pdfDataUri } = req.body || {};

      console.log('Request Body:', req.body);

      if (!email) {
        console.error('No email recipient defined');
        return res.status(400).json({ error: 'Invalid payload: Missing email field' });
      }

      // Konfigurasi transporter untuk layanan email
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', // Ganti dengan host yang sesuai
        secure: false,
        port: 587,
        auth: {
          user: 'admin@human-initiative.org', // Ganti dengan email pengirim
          pass: '1234Pkpu', // Ganti dengan password email pengirim
        },
      });

      // Opsi email
      const mailOptions = {
        from: 'admin@human-initiative.org', // Ganti dengan email pengirim
        to: email,
        subject: 'Certificate Information',
        text: `Dear ${name}, your certificate with number ${certificateNumber} is attached.`,
      };

      // Mengirim email
      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent:', info);

      return res.status(200).json({ success: true, message: 'Email successfully sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};
