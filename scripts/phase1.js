const XlsxPopulate = require("xlsx-populate");
const path = require("path");

/**
 * Phase 1: Load and filter unsent emails from XLSX file
 * @returns {Array} Array of unsent email objects
 */
async function loadUnsentEmails(filePath, openPassword, editPassword) {
  try {
    const workbook = await XlsxPopulate.fromFileAsync(filePath, {
      password:
        openPassword && openPassword.trim() !== "" ? openPassword : undefined,
    });

    const sheet = workbook.sheet(0); // First worksheet
    const data = [];

    // Get all rows
    const rows = sheet.usedRange().value();

    // Skip header row, process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row && row.length >= 2) {
        data.push({
          email: row[0], // Column A
          sent_status: row[1], // Column B
        });
      }
    }

    console.log(`Loaded ${data.length} rows from Excel file`);

    // Filter emails where sent_status is not 'email sent'
    const unsentEmails = data.filter((row) => row.sent_status !== "email sent");

    return unsentEmails;
  } catch (error) {
    console.error("❌ Failed to read the Excel file. Possible issues:");
    console.error("1. File is corrupted or not a valid .xlsx file");
    console.error("2. File is currently open in Excel");
    console.error("3. Wrong file format (should be .xlsx, not .xls)");
    console.error("4. File path is incorrect");
    console.error("5. File doesn't exist");
    console.error("6. Password is incorrect (if file is password-protected)");
    console.error("\nPlease check your data.xlsx file and try again.");
    console.error("Error details:", error.message);
    throw error;
  }
}

module.exports = { loadUnsentEmails };
