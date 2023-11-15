let certificateCounter;
const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;

submitBtn.addEventListener("click", async () => {
  const nameValue = userName.value;
    if (nameValue.trim() !== "" && userName.checkValidity()) {
        console.log(nameValue);
        certificateCounter = generateUniqueNumber();
        await generatePDF(nameValue, certificateCounter);
        await sendToServer(nameValue, certificateCounter);
      } else {
        userName.reportValidity();
      }
});
const generatePDF = async (name, certificateNumber) => {
    const existingPdfBytes = await fetch("CertificateNew.pdf").then((res) =>
      res.arrayBuffer()
    );

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    
  //get font
  const fontBytes = await fetch("Sanchez-Regular.ttf").then((res) =>
  res.arrayBuffer()
);
  // Embed our custom font in the document
  const SanChezFont  = await pdfDoc.embedFont(fontBytes);
   // Get the first page of the document
   const pages = pdfDoc.getPages();
   const firstPage = pages[0];

  // Calculate the center position
   const centerX = firstPage.getWidth() / 2.6;
   const centerY = firstPage.getHeight() / 2.3;

   const centerXno = firstPage.getWidth() / 4;
   const centerYno = firstPage.getHeight() / 3;

   const currentDate = new Date();
   const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
   firstPage.drawText(name, {
     x: centerX,
     y: centerY,
     size: 20,
     font: SanChezFont ,
     color: rgb(1, 1, 1),
   });

   const uniqueNumber = generateUniqueNumber();
   firstPage.drawText(`No. ${formattedDate} 00${certificateNumber} ${uniqueNumber}`, {
    x: centerXno,
    y: centerYno,
    size: 20,
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

const sendToServer = async (name, certificateNumber) => {
  try {
      const response = await fetch('https://certificatehitanampohon.vercel.app/api/saveData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: name,
              certificateNumber: certificateNumber,
          }),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to server');
      }
  
      console.log('Data sent to server successfully');
      alert(name);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
};