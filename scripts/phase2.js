/**
 * Phase 2: Prepare batches of 50 emails each
 * @returns {Array} Array of batches, each containing up to batchSize emails
 */
function prepareBatches(emails, batchSize = 50) {
  const batches = [];
  for (let i = 0; i < emails.length; i += batchSize) {
    batches.push(emails.slice(i, i + batchSize));
  }
  return batches;
}

module.exports = { prepareBatches };
