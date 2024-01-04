let data;

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

submitBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (file) {
    try {
      const workbook = await readExcelFile(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);

      for (let i = 0; i < data.length; i++) {
        const rowData = data[i];

        if (isValidRow(rowData)) {
          const { name, email, telepon } = rowData;
          const nextCertificateNumber = await getNextCertificateNumber();
          const pdfDataUri = await generatePDF(name, nextCertificateNumber);

          hideFormDisplay();
          await sendCertificateData(name, email, telepon, nextCertificateNumber, pdfDataUri);

          showFormDisplay();
          fileInput.value = ""; // Clear file input
        } else {
          console.error("Missing required data in row ", i + 1);
        }
      }

      showDownloadButton();
      showPopup();
    } catch (error) {
      console.log("Error Occurred", error);
    }
  } else {
    console.error("Please select a file");
  }
});

const isValidRow = (rowData) => {
  return rowData.name && rowData.email && rowData.telepon;
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

const sendCertificateData = async (name, email, telepon, certificateNumber, pdfDataUri) => {
  try {
    await sendToServer(name, email, telepon, certificateNumber, pdfDataUri);
  } catch (error) {
    console.error("Error sending certificate data to server:", error);
  }
};

const downloadCertificates = async () => {
  try {
    const zip = new JSZip();

    for (let i = 0; i < data.length; i++) {
      const nextCertificateNumber = await getNextCertificateNumber();
      const pdfDataUri = await generatePDF("PlaceholderName", nextCertificateNumber);

      zip.file(`Certificate_${nextCertificateNumber}.pdf`, pdfDataUri.split("base64,")[1], { base64: true });
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
    const data = await response.json();

    if (data && data.nextCertificateNumber !== undefined) {
      return data.nextCertificateNumber;
    } else {
      throw new Error("Invalid response format from the server");
    }
  } catch (error) {
    console.error("Error getting next certificate number:", error.message);
    throw error;
  }
};

// Other functions remain unchanged
