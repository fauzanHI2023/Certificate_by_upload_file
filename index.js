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
      } else {
        userName.reportValidity();
      }
});
const generatePDF = async (name, certificateNumber) => {
    const existingPdfBytes = await fetch("CertificateBaru.pdf").then((res) =>
      res.arrayBuffer()
    );

    // Memuat dokumen
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fetch("Sanchez-Regular.ttf").then((res) =>
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
   const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
    firstPage.drawText(name, {
      x: 84,
      y: 645,
      size: 20,
      font: SanChezFont ,
      color: rgb(1, 1, 1),
   });

   const uniqueNumber = generateUniqueNumber();
   firstPage.drawText(`${formattedDate} 00${certificateNumber}`, {
      x: 110,
      y: 855,
      size: 14,
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

const sendToServer = async (name, email, certificateNumber) => {
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
          }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim data ke server');
      }
  
      console.log('Data berhasil dikirim ke server');
      alert(name);
    } catch (error) {
      console.error('Kesalahan mengirim data ke server:', error);
    }
};