// Import libraries
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, certificateNumber, pdfDataUri } = req.body;

    console.log('Sending email to:', email);

    // Konfigurasi transporter untuk layanan email
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Ganti dengan host yang sesuai
      port: 587,
      secure: false,
      auth: {
        user: 'Admin@human-initiative.org', // Ganti dengan email pengirim
        pass: '1234Pkpu', // Ganti dengan password email pengirim
      },
    });

    // Opsi email
    const mailOptions = {
      from: 'Admin@human-initiative.org', // Ganti dengan email pengirim
      to: email,
      subject: 'Certificate Information',
      text: `Dear ${name}, your certificate with number ${certificateNumber} is attached.`,
      attachments: [
        {
          filename: 'Certificate-TanamPohon.pdf',
          content: pdfDataUri.replace(/^data:application\/pdf;base64,/, ''),
          encoding: 'base64',
        },
      ],
    };

    try {
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
}
