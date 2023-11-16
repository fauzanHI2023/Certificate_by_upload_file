const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, certificateNumber, pdfDataUri } = req.body;
    
        if (!name || !certificateNumber) {
          return res.status(400).json({ error: 'Name and certificateNumber are required' });
        }

  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: 'fauzan.aldi@human-initiative.org',
        pass: '345678Aldi#@',
      },
    });

    // Send email
    await transporter.sendMail({
      from: 'fauzan.aldi@human-initiative.org',
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
      timeout: 30000,
    });

    console.log('Email sent successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 }
}
