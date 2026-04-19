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
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async ({
  name,
  email,
  events,
  orderNo,
  paymentMethod,
  college,
  participants,
}) => {
  try {
    const eventId = generateEventId(college, events);

    // ✅ SEND TO ALL PARTICIPANT EMAILS
    const allEmails = participants.map((p) => p.email).filter(Boolean);

    // ─── QR CODE ───────────────────────────────────────────────────────────────
    const qrData = `${eventId} | ${name}`;
    const qrPath = path.join(__dirname, `qr-${orderNo}.png`);
    await QRCode.toFile(qrPath, qrData);

    // ─── PDF TICKET ────────────────────────────────────────────────────────────
    const pdfPath = path.join(__dirname, `ticket-${orderNo}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      doc.fontSize(22).fillColor("#e63946").text("KAIROS 2026", { align: "center" });
      doc.moveDown(2);
      doc.rect(80, 120, 430, 100).dash(5).stroke("#e63946");
      doc.fontSize(18).fillColor("#e63946").text(eventId, 0, 160, { align: "center" });
      doc.image(qrPath, 200, 260, { width: 150 });

      // Payment method on PDF
      doc.moveDown(12);
      doc
        .fontSize(12)
        .fillColor("#333")
        .text(
          `Payment Method: ${paymentMethod === "cash" ? "Cash" : "Online (Razorpay)"}`,
          { align: "center" }
        );

      doc.end();
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // ─── PARTICIPANTS TABLE (HTML) ──────────────────────────────────────────────
    const participantHTML = participants
      .map(
        (p, i) => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">${i === 0 ? "Team Leader" : `Member ${i + 1}`}</td>
        <td style="padding:8px; border:1px solid #ddd;">${p.name}</td>
        <td style="padding:8px; border:1px solid #ddd; color:#2563eb;">${p.email}</td>
        <td style="padding:8px; border:1px solid #ddd;">${p.phone}</td>
      </tr>
    `
      )
      .join("");

    // ─── PAYMENT METHOD BADGE ──────────────────────────────────────────────────
    const isCash = paymentMethod === "cash";
    const paymentBadgeColor = isCash ? "#f59e0b" : "#16a34a";
    const paymentLabel = isCash ? "💵 Paid via Cash" : "💳 Paid via Online ";

    // ─── MAIL OPTIONS ──────────────────────────────────────────────────────────
    const mailOptions = {
      from: `"Pegasus - CS Dept" <${process.env.EMAIL_USER}>`,
      to: allEmails.join(","),
      subject: "Kairos 2026 Registration Confirmed 🎉",
      html: `
      <div style="font-family:Arial,sans-serif; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- HEADER -->
          <div style="background:#e63946; color:white; padding:16px; text-align:center;">
            <h1 style="margin:0; font-size:24px; letter-spacing:2px;">KAIROS 2026</h1>
            <p style="margin:4px 0 0; font-size:13px;">Department of Computer Science — ST PAULS COLLEGE</p>
          </div>

          <div style="padding:24px;">

            <p style="font-size:16px;">Hello <b>${name}</b>,</p>
            <p>You have successfully registered for:</p>
            <p style="font-size:16px; color:#e63946;"><b>${Object.keys(events).join(", ")}</b></p>

            <!-- PAYMENT METHOD BADGE -->
            <div style="display:inline-block; background:${paymentBadgeColor}; color:white; padding:6px 16px; border-radius:20px; font-size:14px; font-weight:bold; margin-bottom:20px;">
              ${paymentLabel}
            </div>

            <!-- EVENT ID BOX -->
            <div style="border:2px dashed #e63946; padding:20px; text-align:center; border-radius:8px; margin:20px 0;">
              <p style="margin:0 0 6px; font-size:13px; color:#555;">YOUR UNIQUE EVENT ID</p>
              <h2 style="margin:0; color:#e63946; font-size:28px; letter-spacing:2px;">${eventId}</h2>
            </div>

            <!-- QR CODE -->
            <div style="text-align:center; margin:20px 0;">
              <img src="cid:qrcode" width="140" alt="QR Code" style="border:1px solid #ddd; padding:6px; border-radius:4px;"/>
              <p style="font-size:11px; color:#888; margin-top:6px;">Scan this QR at the event</p>
            </div>

            <!-- REGISTRATION DETAILS -->
            <h3 style="border-bottom:2px solid #e63946; padding-bottom:6px; color:#333;">Registration Details</h3>
            <p><b>College:</b> ${college}</p>
            <p><b>Order No:</b> ${orderNo}</p>
            <p><b>Payment Method:</b> <span style="color:${paymentBadgeColor}; font-weight:bold;">${isCash ? "Cash" : "Online (Razorpay)"}</span></p>

            <!-- PARTICIPANTS TABLE -->
            <table style="width:100%; border-collapse:collapse; margin-top:12px;">
              <thead>
                <tr style="background:#e63946; color:white;">
                  <th style="padding:8px; border:1px solid #ddd;">Role</th>
                  <th style="padding:8px; border:1px solid #ddd;">Name</th>
                  <th style="padding:8px; border:1px solid #ddd;">Email</th>
                  <th style="padding:8px; border:1px solid #ddd;">Phone</th>
                </tr>
              </thead>
              <tbody>
                ${participantHTML}
              </tbody>
            </table>

            <!-- WHATSAPP -->
            <div style="background:#e8f5e9; padding:16px; margin-top:24px; border-radius:6px; text-align:center;">
              <p style="margin:0 0 10px; font-weight:bold;">Join our WhatsApp group for updates!</p>
              <a href="https://chat.whatsapp.com/EgtZBvAxKljLhJZ12P3YRq"
                 style="background:#25D366; color:white; padding:10px 20px; text-decoration:none; border-radius:4px; font-weight:bold;">
                 Join WhatsApp Group →
              </a>
            </div>

            <hr style="margin:24px 0; border:none; border-top:1px solid #eee;">

            <p style="font-size:12px; color:#888; text-align:center;">
              Pegasus — Department of Computer Science<br>
              ST PAULS COLLEGE
            </p>

          </div>
        </div>
      </div>
      `,
      attachments: [
        { filename: "qr.png", path: qrPath, cid: "qrcode" },
        { filename: `Kairos_Ticket_${orderNo}.pdf`, path: pdfPath },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ EMAIL SENT TO:", allEmails.join(", "));

    // ─── CLEANUP TEMP FILES ────────────────────────────────────────────────────
    try {
      fs.unlinkSync(qrPath);
      fs.unlinkSync(pdfPath);
    } catch (_) {}

  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};

module.exports = sendConfirmationEmail;