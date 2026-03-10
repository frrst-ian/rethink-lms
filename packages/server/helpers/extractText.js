const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fetchBuffer = require("./fetchBuffer");

async function extractText(fileUrl, fileType) {
    const buffer = await fetchBuffer(fileUrl);

    if (fileType == "pdf") {
        const { text } = await pdfParse(buffer);
        return text;
    }

    if (fileType == "docx") {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
    }

    return null;
}

module.exports = extractText;
