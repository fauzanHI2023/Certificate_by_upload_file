console.log("hello")
const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;

submitBtn.addEventListener("click", async () => {
  const nameValue = userName.value;
    if (nameValue.trim() !== "" && userName.checkValidity()) {
        console.log(nameValue);
        await generatePDF(nameValue);
      } else {
        userName.reportValidity();
      }
});
const generatePDF = async (name) => {
    const existingPdfBytes = await fetch("Certificate.pdf").then((res) =>
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
 
   // Draw a string of text diagonally across the first page
   const currentDate = new Date();
   const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
   firstPage.drawText(name, {
     x: 300,
     y: 270,
     size: 40,
     font: SanChezFont ,
     color: rgb(0.2, 0.84, 0.67),
   });

   firstPage.drawText(`Tanggal ${formattedDate} ${uniqueNumber}`, {
    x: 300,
    y: 70,
    size: 20,
    font: SanChezFont ,
    color: rgb(0.2, 0.84, 0.67),
  });

  const uniqueNumber = generateUniqueNumber();
 
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  saveAs(pdfDataUri,"newcertificate.pdf")
};

const generateUniqueNumber = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

