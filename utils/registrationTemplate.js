const fs = require("fs")
const path = require("path")
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib")
const fontkit = require("fontkit")

async function generateRegistrationPDF(
  name,
  father,
  mother,
  gender,
  birthday,
  number,
  registration,
  sid
) {
  try {
    const formData = [
      name,
      father,
      mother,
      gender,
      birthday,
      number,
      registration,
      sid,
    ]

    const pdfPath = path.join(__dirname, "templates", "pdf", "registration.pdf")
    const pdfBuffer = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBuffer)

    // Registering FontKit
    pdfDoc.registerFontkit(fontkit)

    // Embed the font

    const fontPath = path.join(__dirname, "fonts", "roboto.ttf")
    const customFontBytes = fs.readFileSync(fontPath)
    const robotoFont = await pdfDoc.embedFont(customFontBytes)

    // Get the first page
    const [page] = pdfDoc.getPages()

    // Initial Y-position and gap between rows
    const startX = 279
    const startY = 464
    const lineSpacing = 29

    formData.forEach((text, index) => {
      page.drawText(text, {
        x: startX,
        y: startY - index * lineSpacing,
        size: 13,
        font: robotoFont,
        color: rgb(0, 0, 0),
      })
    })

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    page.drawText("January-December 2025", {
      x: 400,
      y: 264,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    })

    // Load and embed image (JPEG)
    const imagePath = path.join(__dirname, "../", "public", "img", "image.jpeg")
    const imageBytes = fs.readFileSync(imagePath)
    const image = await pdfDoc.embedJpg(imageBytes)
    const { width, height } = image

    // Define image box dimensions and position
    const targetWidth = 100
    const targetHeight = 150
    const xPos = 407
    const yPos = 492

    // Maintain aspect ratio while scaling
    const scale = Math.min(targetWidth / width, targetHeight / height)
    const scaledWidth = width * scale
    const scaledHeight = height * scale

    // Optional: Draw a rectangle around the image (as a frame)
    page.drawRectangle({
      x: xPos - 1,
      y: yPos - 1,
      width: scaledWidth + 2,
      height: scaledHeight + 2,
      borderColor: rgb(0, 0.4, 0.8),
      borderWidth: 1,
    })

    // Draw the image inside the rectangle
    page.drawImage(image, {
      x: xPos,
      y: yPos,
      width: scaledWidth,
      height: scaledHeight,
    })

    // Save the updated PDF
    const updatedPdfBytes = await pdfDoc.save()

    const fileName = `${formData[0].split(" ").join("_")}-registration-card.pdf`
    const savePath = path.join(
      __dirname,
      "../",
      "public",
      "generated",
      "reg",
      fileName
    )

    fs.writeFileSync(savePath, updatedPdfBytes)

    console.log("✅ PDF updated successfully.")
  } catch (err) {
    console.error("❌ Failed to edit PDF:", err.message)
  }
}

module.exports = generateRegistrationPDF
