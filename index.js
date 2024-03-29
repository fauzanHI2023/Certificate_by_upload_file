let data;
let startingCertificateNumber;

const submitBtn = document.getElementById("submitBtn");
const overlay = document.getElementById("close");
const popup = document.getElementById("popup");
const fileInput = document.getElementById("fileInput");
const downloadCertificatesBtn = document.getElementById("downloadCertificatesBtn");

overlay.onclick = function () {
  popup.style.display = 'none';
};

downloadCertificatesBtn.onclick = function () {
  downloadCertificates();
};

const { PDFDocument, rgb } = PDFLib;

submitBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    console.error("Please select a file");
    return;
  }

  try {
    const workbook = await readExcelFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);

    startingCertificateNumber = await getNextCertificateNumber();

    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];

      if (isValidRow(rowData)) {
        const { name, email, telepon } = rowData;
        const pdfDataUri = await generatePDF(name, startingCertificateNumber + i);

        hideFormDisplay();
        await sendCertificateData(name, email, telepon, startingCertificateNumber + i, pdfDataUri);

        showFormDisplay();
        fileInput.value = ""; // Clear file input
      } else {
        console.error("Missing required data in row ", i + 1);
      }
    }

    showDownloadButton();
    showPopup();
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

const isValidRow = (rowData) => {
  return rowData.name !== undefined && rowData.email !== undefined && rowData.telepon !== undefined;
};

const hideFormDisplay = () => {
  document.getElementById("form-display").style.display = "none";
  document.getElementById("loading-animation").style.display = "flex";
};

const showFormDisplay = () => {
  document.getElementById("form-display").style.display = "block";
};

const showDownloadButton = () => {
  downloadCertificatesBtn.style.display = "inline";
};

const showPopup = () => {
  document.getElementById("popup").style.display = "flex";
};

const generatePDF = async (name, certificateNumber) => {
  try {
    const existingPdfBytes = await fetch("CertificateFiks.pdf").then((res) => res.arrayBuffer());

    // Load the existing PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch("AvenirNextLTPro-Regular.otf").then((res) => res.arrayBuffer());
    // Embed the font into the PDF document
    const sanChezFont = await pdfDoc.embedFont(fontBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add text to the PDF document
    const currentDate = new Date();
    const lastTwoDigitsOfYear = String(currentDate.getFullYear()).slice(-2);
    const formattedDate = `${lastTwoDigitsOfYear}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

    firstPage.drawText(name, {
      x: 130,
      y: 1035,
      size: 36,
      font: sanChezFont,
      color: rgb(1, 1, 1),
    });

    firstPage.drawText(`${formattedDate}-00${certificateNumber}`, {
      x: 170,
      y: 1370,
      size: 22,
      font: sanChezFont,
      color: rgb(1, 1, 1),
    });

    // Save the PDF as a base64 data URI
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

const sendCertificateData = async (name, email, telepon, certificateNumber, pdfDataUri) => {
  try {
    const response = await fetch(
      "https://certificatehitanampohon.vercel.app/api/saveData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          telepon: telepon,
          certificateNumber: certificateNumber,
          pdfDataUri: pdfDataUri,
        }), 
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to send data to server. Server response: ${errorMessage}`
      );
    }

    console.log("Data berhasil dikirim ke server");
  } catch (error) {
    console.error("Kesalahan mengirim data ke server:", error);
  }
};

const downloadCertificates = async () => {
  try {
    const zip = new JSZip();

    for (let i = 0; i < data.length; i++) {
      const pdfDataUri = await generatePDF(data[i].name, startingCertificateNumber + i);

      zip.file(`Certificate_${startingCertificateNumber + i}.pdf`, pdfDataUri.split("base64,")[1], { base64: true });
    }

    const zipContent = await zip.generateAsync({ type: "blob" });

    saveAs(zipContent, "Certificates.zip");
  } catch (error) {
    console.error("Error generating zip file", error);
  }
};

// Function to read Excel file
const readExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      resolve(workbook);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Function to get the next certificate number
const getNextCertificateNumber = async () => {
  try {
    const response = await fetch(
      "https://certificatehitanampohon.vercel.app/api/getNextCertificateNumber"
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch next certificate number. Server response: ${response.statusText}`
      );
    }
    const responseData = await response.json();

    if (responseData && responseData.nextCertificateNumber !== undefined) {
      return responseData.nextCertificateNumber;
    } else {
      throw new Error("Invalid response format from the server");
    }
  } catch (error) {
    console.error("Error getting next certificate number:", error.message);
    throw error;
  }
};