const ExcelJS = require("exceljs");

/**
 * Phase 4: Update sent status in XLSX file
 */
async function updateSentStatus(filePath, sentEmails, editPassword) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath, { password: editPassword });

    const worksheet = workbook.getWorksheet(1); // First worksheet

    // Find and update sent_status for sent emails
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const emailCell = row.getCell(1); // Assuming email is in column 1
        const statusCell = row.getCell(2); // Assuming sent_status is in column 2

        if (sentEmails.includes(emailCell.value)) {
          statusCell.value = "email sent";
        }
      }
    });

    // Save back to file with password protection
    await workbook.xlsx.writeFile(filePath, { password: editPassword });

    console.log(`Updated sent status for ${sentEmails.length} emails`);
  } catch (error) {
    console.error("❌ Failed to update the Excel file:", error.message);
    throw error;
  }
}

module.exports = { updateSentStatus };
