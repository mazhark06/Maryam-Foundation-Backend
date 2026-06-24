import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

// 1. Setup your email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailmaryamfoundation@gmail.com",
    pass: "jhrf sioo evhx pxmi" // ⚠️ REPLACE THIS ONCE YOU GENERATE A NEW ONE
  }
});

export async function sendDonationReceiptEmail(donationData) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];

  // Capture the PDF data stream chunks
  doc.on("data", buffers.push.bind(buffers));

  const pdfReady = new Promise((resolve, reject) => {
    doc.on("end", async () => {
      try {
        const pdfData = Buffer.concat(buffers);

        const mailOptions = {
          from: '"Maryam Foundation" <mailmaryamfoundation@gmail.com>',
          to: donationData.email ,
          subject: `Official Donation Receipt - Thank You!`,
          text: `Dear ${donationData.name},\n\nThank you for your donation. Your payment has been verified. Please find your official receipt attached to this email.`,
          attachments: [
            {
              filename: `Receipt-${donationData.transactionId}.pdf`,
              content: pdfData,
              contentType: "application/pdf"
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        console.log("✨ Email with PDF attachment sent successfully!");
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });

    doc.on("error", reject);
  });

  // --- FIXED & CLEANED PDF LAYOUT DESIGN ---
  const receiptNo = donationData.receiptNo || `REC-${donationData._id?.toString().substring(18).toUpperCase() || 'TEST'}`;

  // Outer Decorative Border
  doc.rect(20, 20, 572, 752).stroke("#cccccc");
  
  // Header Info
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#28a745").text("MARYAM FOUNDATION", { align: "center" });
  doc.font("Helvetica").fontSize(10).fillColor("#666666").text("Patna, Bihar, India | Support: info@yourdomain.org", { align: "center" });
  doc.moveDown(2);

  // Receipt Banner Title
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000").text("OFFICIAL DONATION RECEIPT", { align: "center", underline: true });
  doc.moveDown(2);

  // Core Donor Details
  doc.font("Helvetica").fontSize(12).fillColor("#333333");
  doc.text(`Receipt Number: ${receiptNo}`);
  doc.moveDown(0.5);
  doc.text(`Donor Name: ${donationData.donorName}`);
  doc.moveDown(0.5);
  doc.text(`Phone Number: ${donationData.phoneNumber}`);
  doc.moveDown(0.5);
  doc.text(`Transaction ID (UTR): ${donationData.transactionID}`);
  doc.moveDown(2);

  // FIXED: Dynamic Background Box & Text Alignment for Amount Banner
  const boxY = doc.y; // Get current vertical cursor spot
  doc.fillColor("#f8f9fa").rect(50, boxY, 490, 40).fill(); // Draw & fill background tint
  
  // Overlay the green text precisely inside the bounding area
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#28a745").text(
    `TOTAL AMOUNT VERIFIED: Rs. ${donationData.amount}/- in ${donationData.programTitle} Program`, 
    65, 
    boxY + 14
  );
  
  // Move cursor down safely below the box layout elements
  doc.font("Helvetica").moveDown(4);
  doc.fontSize(10).fillColor("#888888").text(
    "This is an electronically verified document issued upon receipt of funds. No physical signature is required.",
    { align: "center", italic: true }
  );

  doc.end();
  return pdfReady;
}
