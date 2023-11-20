import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, certificateNumber, pdfDataUri } = req.body || {};

      console.log('Sending email to:', email);

      // Konfigurasi transporter untuk layanan email
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Ganti dengan host yang sesuai
        secure: false,
        port: 587,
        auth: {
          user: 'antoalfian004@gmail.com', // Ganti dengan email pengirim
          pass: '345678Aldi', // Ganti dengan password email pengirim
        },
      });

      // Opsi email
      const mailOptions = {
        from: 'antoalfian004@gmail.com', // Ganti dengan email pengirim
        to: email,
        subject: 'Certificate Information',
        text: `Dear ${name}, your certificate with number ${certificateNumber} is attached.`,
      };

      if (pdfDataUri && typeof pdfDataUri === 'string' && pdfDataUri.startsWith('data:application/pdf;base64,')) {
        mailOptions.attachments = [
          {
            filename: 'Certificate-TanamPohon.pdf',
            content: pdfDataUri.replace(/^data:application\/pdf;base64,/, ''),
            encoding: 'base64',
          },
        ];
      } else {
        console.error('Invalid pdfDataUri:', pdfDataUri);
        return res.status(400).json({ error: 'Invalid pdfDataUri' });
      }

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
