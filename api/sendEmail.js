const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  const { name, email, certificateNumber, pdfDataUri } = req.body;

  // Validate input
  if (!name || !email || !certificateNumber || !pdfDataUri) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'Admin@human-initiative.org',
        pass: '1234Pkpu',
      },
    });

    // Send email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Certificate Attached',
      text: `Dear ${name},\n\nThank you for submitting the form. Your certificate is attached.\n\nBest Regards,\nYour Organization`,
      attachments: [
        {
          filename: 'Certificate-TanamPohon.pdf',
          content: pdfDataUri.split('base64,')[1],
          encoding: 'base64',
        },
      ],
    });

    console.log('Email sent successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
