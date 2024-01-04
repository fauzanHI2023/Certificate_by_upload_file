let data; // Declare data in a scope accessible to other functions

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

        if (rowData.name && rowData.email && rowData.telepon) {
          const nameValue = rowData.name;
          const emailValue = rowData.email;
          const teleponValue = rowData.telepon;

          const nextCertificateNumber = await getNextCertificateNumber();
          const pdfDataUri = await generatePDF(nameValue, nextCertificateNumber);

          document.getElementById("form-display").style.display = "none";
          document.getElementById("loading-animation").style.display = "flex";

          await sendToServer(
            nameValue,
            emailValue,
            teleponValue,
            nextCertificateNumber,
            pdfDataUri
          );

          document.getElementById("form-display").style.display = "block";
          fileInput.value = ""; // Clear file input
        } else {
          console.error("Missing required data in row ", i + 1);
        }
      }

      downloadCertificatesBtn.style.display = "inline"; // Show download button
      document.getElementById("popup").style.display = "flex";
    } catch (error) {
      console.log("Error Occurred", error);
    }
  } else {
    console.error("Please select a file");
  }
});

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

// Other functions remain unchanged
