let certificateCounter;
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;

submitBtn.addEventListener("click", async () => {
  const nameValue = userName.value;
  const emailValue = userEmail.value;
    if (nameValue.trim() !== "" && userName.checkValidity()) {
        console.log(nameValue);
        certificateCounter = generateUniqueNumber();
        await generatePDF(nameValue, certificateCounter);
        await sendToServer(nameValue, emailValue, certificateCounter);
        await sendEmail(nameValue, certificateCounter);
      } else {
        userName.reportValidity();
      }
});
const generatePDF = async (name, certificateNumber) => {
    const existingPdfBytes = await fetch("CertificateFiks.pdf").then((res) =>
      res.arrayBuffer()
    );

    // Memuat dokumen
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fetch("AvenirNextLTPro-Regular.otf").then((res) =>
  res.arrayBuffer()
);
  // Memasukkan font ke dokumen
  const SanChezFont  = await pdfDoc.embedFont(fontBytes);
   // Halaman pertama dokumen
   const pages = pdfDoc.getPages();
   const firstPage = pages[0];

  // Menghitung position
  //  const text = name;
  //  const textWidth = SanChezFont.widthOfTextAtSize(text, 20);
   const centerX = firstPage.getWidth() / 2.6;
   const centerY = firstPage.getHeight() - 2;

   const centerXno = firstPage.getWidth() / 4;
   const centerYno = firstPage.getHeight() / 2;

   const currentDate = new Date();
   const lastTwoDigitsOfYear = String(currentDate.getFullYear()).slice(-2);
   const formattedDate = `${lastTwoDigitsOfYear}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    firstPage.drawText(name, {
      x: 130,
      y: 1035,
      size: 36,
      font: SanChezFont ,
      color: rgb(1, 1, 1),
   });

   firstPage.drawText(`${formattedDate}-00${certificateNumber}`, {
      x: 170,
      y: 1370,
      size: 22,
      font: SanChezFont ,
      color: rgb(1, 1, 1),
   });
 
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  saveAs(pdfDataUri,"Certificate-TanamPohon.pdf")
};

const generateUniqueNumber = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

const sendToServer = async (name, email, certificateNumber, pdfDataUri) => {
  try {
      const response = await fetch('https://certificatehitanampohon.vercel.app/api/saveData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: name,
              email: email,
              certificateNumber: certificateNumber,
              pdfDataUri: pdfDataUri,
          }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to send data to server. Server response: ${errorMessage}`);
      }
  
      console.log('Data berhasil dikirim ke server');
      await sendEmail(name, email, certificateNumber, pdfDataUri);
      alert(name);
    } catch (error) {
      console.error('Kesalahan mengirim data ke server:', error);
    }
};

const sendEmail = async (name, email, certificateNumber, pdfDataUri) => {
  try {
    const emailResponse = await fetch('https://certificatehitanampohon.vercel.app/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        certificateNumber: certificateNumber,
        pdfDataUri: pdfDataUri,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};