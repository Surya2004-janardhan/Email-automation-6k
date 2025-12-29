const XlsxPopulate = require("xlsx-populate");

/**
 * Phase 4: Update sent status in XLSX file
 */
async function updateSentStatus(
  filePath,
  sentEmails,
  editPassword,
  openPassword
) {
  try {
    // Use openPassword for reading since that's what protects the file
    const readPassword =
      openPassword && openPassword.trim() !== "" ? openPassword : undefined;

    const workbook = await XlsxPopulate.fromFileAsync(filePath, {
      password: readPassword,
    });

    const sheet = workbook.sheet(0); // First worksheet

    let updatedCount = 0;

    // Get all rows and update sent_status for sent emails
    const rows = sheet.usedRange().value();

    for (let i = 1; i < rows.length; i++) {
      // Skip header row
      const row = rows[i];
      if (row && row.length >= 2) {
        const emailValue = row[0]; // Column A

        if (emailValue && sentEmails.includes(emailValue)) {
          // Update column B (sent_status) to "email sent"
          sheet.cell(i + 1, 2).value("email sent"); // Row i+1, Column 2
          updatedCount++;
        }
      }
    }

    // Save back to file with password protection if provided
    const writePassword =
      editPassword && editPassword.trim() !== "" ? editPassword : undefined;
    await workbook.toFileAsync(filePath, { password: writePassword });

    if (writePassword) {
      console.log("Successfully saved Excel file with password protection");
    } else {
      console.log("Successfully saved Excel file");
    }

    console.log(`Updated sent status for ${updatedCount} emails`);
  } catch (error) {
    console.error("❌ Failed to update the Excel file:", error.message);
    console.error(
      "Make sure the file is not open in Excel and the path is correct"
    );
    throw error;
  }
}

module.exports = { updateSentStatus };
