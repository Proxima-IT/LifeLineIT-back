const fs = require("fs")
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib")
const QRCode = require("qrcode")
const fontkit = require("fontkit")
const path = require("path")

const formatDate = () => {
  const options = { day: "numeric", month: "long", year: "numeric" }
  return new Date().toLocaleDateString("en-US", options) // e.g., "July 10, 2025"
}

async function generateCertificate(
  name,
  course,
  grade,
  courseDuration,
  certificateId,
  sid,
  regid,
  instructorName
) {
  // Importing the Template

  try {
    const pdfPath = path.join(__dirname, "templates", "pdf", "certificate.pdf")
    const pdfBytes = fs.readFileSync(pdfPath) // Read file as buffer
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const page = pdfDoc.getPages()[0]

    // Generate QR Code
    const qrDataUrl = await QRCode.toDataURL(
      `/certificate/verify?cert=${certificateId}`
    )
    const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64")
    const qrImage = await pdfDoc.embedPng(qrImageBytes)

    const qrDims = qrImage.scale(0.4)

    page.drawImage(qrImage, {
      x: 702,
      y: 352,
      width: qrDims.width,
      height: qrDims.height,
    })

    // Initializing for using custom fonts
    pdfDoc.registerFontkit(fontkit)

    // Embed the font
    const exomediumFontBytes = fs.readFileSync(
      path.join(__dirname, "./fonts/exomedium.otf")
    )
    const robotoFontBytes = fs.readFileSync(
      path.join(__dirname, "./fonts/roboto.ttf")
    )
    const robotoBoldFontBytes = fs.readFileSync(
      path.join(__dirname, "./fonts/robotobold.ttf")
    )

    const exomediumFont = await pdfDoc.embedFont(exomediumFontBytes)
    const robotoFont = await pdfDoc.embedFont(robotoFontBytes)
    const robotoBoldFont = await pdfDoc.embedFont(robotoBoldFontBytes)

    const pageWidth = page.getWidth() // Get Page Width
    const centerX = pageWidth / 2 // Page's Center (divided by 2)

    // Get text width (How long width the text will take) in PDF points
    const nameTextWidth = exomediumFont.widthOfTextAtSize(name, 25)

    // Calculate X position to center the text
    let x = centerX - nameTextWidth / 2

    page.drawText(name, {
      x,
      y: 290,
      size: 25,
      font: exomediumFont,
      color: rgb(0, 0, 0),
    })

    const courseTextWidth = robotoFont.widthOfTextAtSize(course, 18)

    x = centerX - courseTextWidth / 2

    page.drawText(course, {
      x,
      y: 140,
      size: 18,
      font: robotoBoldFont,
      color: rgb(0 / 255, 146 / 255, 210 / 255),
    })

    page.drawText(grade, {
      x: 603,
      y: 234,
      size: 16,
      font: robotoBoldFont,
      color: rgb(1, 0, 0),
    })

    page.drawText(courseDuration, {
      x: 444,
      y: 189,
      size: 13,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(certificateId, {
      x: 436,
      y: 117,
      size: 10,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(sid, {
      x: 432,
      y: 100,
      size: 10,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(regid, {
      x: 432,
      y: 82,
      size: 10,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(formatDate(), {
      x: 430,
      y: 56,
      size: 10,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(instructorName, {
      x: 100,
      y: 78,
      size: 13.5,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    page.drawText("Instructor", {
      x: 100,
      y: 67,
      size: 9,
      font: robotoFont,
      color: rgb(0, 0, 0),
    })

    const updatedPdfBytes = await pdfDoc.save()

    console.log("✅ PDF updated successfully.")
    return updatedPdfBytes
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = generateCertificate
