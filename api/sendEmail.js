import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, certificateNumber, pdfDataUri } = req.body;

    console.log('Sending email to:', email);

    // Pengaturan API atau endpoint dari resend.com
    const resend = new Resend('re_DgNVekbB_6atKyyq2GRJC997b6z6GqUg6'); // Ganti dengan URL yang sesuai

    // Data yang akan dikirim ke resend.com
    resend.emails.send({
      from: 'admin@human-initiative.org', // Ganti dengan email pengirim dari resend.com
      to: email,
      subject: 'Certificate Information',
      html: `Dear ${name}, your certificate with number ${certificateNumber} is attached.`,
      attachments: [
        {
          filename: 'Certificate-TanamPohon.pdf',
          content: pdfDataUri.replace(/^data:application\/pdf;base64,/, ''),
        },
      ],
      // Tambahan data yang mungkin diperlukan oleh API resend.com
      // ...
    });

    try {
      // Mengirim data ke resend.com
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tambahan header atau token otorisasi mungkin diperlukan
          // ...
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('Email sent successfully');
        return res.status(200).json({ success: true, message: 'Email successfully sent' });
      } else {
        console.error('Failed to send email:', response.statusText);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error sending email:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};