const escapePdfText = (value = "") =>
  String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r?\n/g, " ");

const buildPdfDocument = (contentStream) => {
  const streamLength = Buffer.byteLength(contentStream, "utf8");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  }
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
};

export const buildReceiptPdf = (payload) => {
  const lines = [
    { text: "CiviConnect - PAYMENT RECEIPT", size: 18, y: 800 },
    { text: "Official Digital Receipt", size: 11, y: 780 },
    { text: "----------------------------------------------", size: 11, y: 768 },
    { text: `Transaction Ref: ${payload.transactionRef}`, size: 12, y: 744 },
    { text: `Transaction Date: ${payload.transactionDateTime}`, size: 12, y: 726 },
    { text: `Payment Status: ${payload.status}`, size: 12, y: 708 },
    { text: `Service Type: ${payload.serviceType}`, size: 12, y: 690 },
    { text: `Account ID: ${payload.accountId}`, size: 12, y: 672 },
    { text: `Bill Period: ${payload.billPeriod || "N/A"}`, size: 12, y: 654 },
    { text: `Amount Paid (INR): ${payload.amount}`, size: 12, y: 636 },
    { text: `Receipt Mode: ${payload.receiptMode}`, size: 12, y: 618 },
    { text: "----------------------------------------------", size: 11, y: 600 },
    { text: `Resident Name: ${payload.fullName}`, size: 12, y: 578 },
    { text: `Phone: +91 ${payload.phone}`, size: 12, y: 560 },
    { text: `Email: ${payload.email}`, size: 12, y: 542 },
    { text: `Address: ${payload.address}`, size: 12, y: 524 },
    { text: `Ward: ${payload.ward}`, size: 12, y: 506 },
    { text: `Aadhaar: ${payload.aadhaarMasked}`, size: 12, y: 488 },
    { text: "----------------------------------------------", size: 11, y: 468 },
    { text: "This is a system-generated receipt and does not require signature.", size: 10, y: 446 },
    { text: "For support, contact 1800-123-4545 or helpdesk@suvidhaone.in", size: 10, y: 430 },
  ];

  const contentStream = lines
    .map((line) => `BT /F1 ${line.size} Tf 48 ${line.y} Td (${escapePdfText(line.text)}) Tj ET`)
    .join("\n");

  return buildPdfDocument(contentStream);
};

