const ExcelJS = require("exceljs");
const path = require("path");

/**
 * Phase 1: Load and filter unsent emails from XLSX file
 * @returns {Array} Array of unsent email objects
 */
async function loadUnsentEmails(filePath, openPassword, editPassword) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath, { password: openPassword });

    const worksheet = workbook.getWorksheet(1); // First worksheet
    const data = [];

    // Convert worksheet to JSON
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          const headerCell = worksheet.getCell(1, colNumber);
          rowData[headerCell.value] = cell.value;
        });
        data.push(rowData);
      }
    });

    // Filter emails where sent_status is not 'email sent'
    const unsentEmails = data.filter((row) => row.sent_status !== "email sent");

    return unsentEmails;
  } catch (error) {
    if (
      error.message.includes("password") ||
      error.message.includes("Password")
    ) {
      console.error("❌ Failed to open the Excel file. Please check:");
      console.error("1. The XLSX_OPEN_PASSWORD in your .env file is correct");
      console.error("2. The file is not currently open in Excel");
      console.error("3. The password is for opening the file (not editing)");
      console.error(
        "Current open password from env:",
        openPassword ? "***set***" : "NOT SET"
      );
    }
    throw error;
  }
}

module.exports = { loadUnsentEmails };
