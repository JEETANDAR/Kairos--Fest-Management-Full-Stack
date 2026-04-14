const nodemailer = require("nodemailer");
const generateEventId = require("./generateEventId");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async ({
  name,
  email,
  events,
  orderNo,
  paymentMethod,
  college,
  participants
}) => {
  try {
    const eventId = generateEventId(college, events);

    // ✅ SEND TO ALL EMAILS
    const allEmails = participants.map(p => p.email).filter(Boolean);

    // ---------------- QR ----------------
    const qrData = `${eventId} | ${name}`;
    const qrPath = path.join(__dirname, `qr-${orderNo}.png`);
    await QRCode.toFile(qrPath, qrData);

    // ---------------- CLEAN PDF ----------------
    const pdfPath = path.join(__dirname, `ticket-${orderNo}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(22).fillColor("#e63946").text("KAIROS 2026", { align: "center" });

    doc.moveDown(2);

    doc.rect(80, 120, 430, 100).dash(5).stroke("#e63946");

    doc.fontSize(18).fillColor("#e63946").text(eventId, 0, 160, { align: "center" });

    doc.image(qrPath, 200, 260, { width: 150 });

    doc.end();

    // ---------------- PARTICIPANTS TABLE ----------------
    const participantHTML = participants.map((p, i) => `
      <tr>
        <td>${i === 0 ? "Team Leader" : `Member ${i + 1}`}</td>
        <td>${p.name}</td>
        <td style="color:#2563eb;">${p.email}</td>
        <td>${p.phone}</td>
      </tr>
    `).join("");

    const mailOptions = {
      from: `"Pegasus - CS Dept" <${process.env.EMAIL_USER}>`,

      // ✅ FIXED HERE
      to: allEmails.join(","),

      subject: "Kairos 2026 Registration Confirmed 🎉",

      html: `
      <div style="font-family:Arial; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:20px;">
          
          <div style="background:#e63946; color:white; padding:12px; text-align:center;">
            KAIROS 2026
          </div>

          <p>Hello <b>${name}</b>,</p>

          <p>
            Registered for 
            <b style="color:#e63946;">${Object.keys(events).join(", ")}</b>
          </p>

          <div style="border:2px dashed red; padding:20px; text-align:center; margin:20px 0;">
            <p>YOUR UNIQUE EVENT ID</p>
            <h2 style="color:#e63946;">${eventId}</h2>
          </div>

          <div style="text-align:center;">
            <img src="cid:qrcode" width="140"/>
          </div>

          <h3>Registration Details</h3>
          <p><b>College:</b> ${college}</p>
          <p><b>Order No:</b> ${orderNo}</p>

          <table border="1" style="width:100%; border-collapse:collapse;">
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
            ${participantHTML}
          </table>

          <div style="background:#e8f5e9; padding:15px; margin-top:20px;">
            <a href="https://chat.whatsapp.com/EgtZBvAxKljLhJZ12P3YRq"
               style="background:#25D366; color:white; padding:10px 15px; text-decoration:none;">
               Join WhatsApp →
            </a>
          </div>

          <hr>

          <p style="font-size:12px;">
            Pegasus - Department of Computer Science<br>
            ST PAULS COLLEGE
          </p>

        </div>
      </div>
      `,

      attachments: [
        { filename: "qr.png", path: qrPath, cid: "qrcode" },
        { filename: `Kairos_Ticket_${orderNo}.pdf`, path: pdfPath }
      ]
    };

    await transporter.sendMail(mailOptions);

    console.log("🔥 EMAIL SENT TO ALL PARTICIPANTS");

  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};

module.exports = sendConfirmationEmail;