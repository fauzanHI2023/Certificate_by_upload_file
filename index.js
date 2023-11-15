let certificateCounter = null;
const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;

submitBtn.addEventListener("click", async () => {
  const nameValue = userName.value;
    if (nameValue.trim() !== "" && userName.checkValidity()) {
        console.log(nameValue);
        certificateCounter++;
        await sendToServer(nameValue);
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
 
   
   // Draw a string of text diagonally across the first pagest

   const currentDate = new Date();
   const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
   firstPage.drawText(name, {
     x: 250,
     y: 400,
     size: 20,
     font: SanChezFont ,
     color: rgb(0.2, 0.84, 0.67),
   });

   const certificateNumber = certificateCounter++;
   firstPage.drawText(`No. ${formattedDate} 00${certificateNumber} ${uniqueNumber}`, {
    x: 300,
    y: 70,
    size: 20,
    font: SanChezFont ,
    color: rgb(0.2, 0.84, 0.67),
  });
 
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  saveAs(pdfDataUri,"newcertificate.pdf")
};

const generateUniqueNumber = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

const sendToServer = async (name) => {
  try {
      const response = await fetch('https://certificatehitanampohon.vercel.app/api/saveData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: name,
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to send data to server');
      }

      const responseData = await response.json();
    if (responseData.success) {
      // Store the received certificate number globally
      certificateCounter = responseData.certificateNumber;

      // Generate PDF using the received certificate number
      generatePDF(name, certificateCounter);

      console.log('Data sent to server successfully');
    } else {
      throw new Error('Failed to save data on the server');
    }
  } catch (error) {
    console.error('Error sending data to server:', error);
  }
};