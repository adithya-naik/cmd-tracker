/*
 * export.js
 *
 * Handles "tracker export" command
 *
 * tracker export         → exports as JSON (default)
 * tracker export --csv   → exports as CSV file
 *
 * Creates a file in user's current directory:
 * → tracker-export.json
 * → tracker-export.csv
 */

const fs = require("fs");
const path = require("path");
const { readCommands } = require("../utils/storage");

/*
 * exportCommand() — main function
 *
 * @param {object} options — contains flags from terminal
 *                           options.csv → true if user passed --csv
 */
function exportCommand(options) {

  /*
   * Read all saved commands
   */
  const data = readCommands();

  /*
   * Check if any commands exist
   */
  const total = Object.values(data).reduce(
    (sum, commands) => sum + commands.length, 0
  );

  if (total === 0) {
    console.log("\n📭 No commands to export yet!\n");
    return;
  }

  /*
   * If user passed --csv flag → export as CSV
   * Otherwise → export as JSON (default)
   */
  if (options.csv) {
    exportAsCSV(data, total);
  } else {
    exportAsJSON(data, total);
  }
}

/*
 * exportAsJSON() — saves commands as .json file
 *
 * @param {object} data  — all commands object
 * @param {number} total — total command count
 */
function exportAsJSON(data, total) {

  /*
   * Build export object with metadata
   * Good practice — always include when and how many
   */
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalCommands: total,
    commands: data
  };

  /*
   * Save in user's current directory
   * process.cwd() → their project folder
   */
  const filePath = path.join(process.cwd(), "tracker-export.json");

  /*
   * JSON.stringify with null, 2 → nicely formatted
   */
  fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

  console.log(`\n✅ Exported ${total} commands to tracker-export.json`);
  console.log(`📁 Location: ${filePath}\n`);
}

/*
 * exportAsCSV() — saves commands as .csv file
 *
 * CSV = Comma Separated Values
 * Opens in Excel, Google Sheets etc.
 *
 * Format:
 * category, command, date
 * git, git status, 5/8/2026
 * npm, npm install, 5/8/2026
 *
 * @param {object} data  — all commands object
 * @param {number} total — total command count
 */
function exportAsCSV(data, total) {

  /*
   * Start with header row
   * Every CSV needs headers as first line
   */
  let csvContent = "category,command,date\n";

  /*
   * Loop through each category and command
   * Build one CSV row per command
   */
  for (const [category, commands] of Object.entries(data)) {
    for (const item of commands) {

      const date = new Date(item.time).toLocaleDateString();

      /*
       * Wrap command in quotes → handles commas inside commands
       * Example: git commit -m "first commit"
       * Without quotes → CSV breaks at the comma
       * With quotes    → CSV reads it as one value ✅
       */
      csvContent += `${category},"${item.command}",${date}\n`;
    }
  }

  const filePath = path.join(process.cwd(), "tracker-export.csv");
  fs.writeFileSync(filePath, csvContent);

  console.log(`\n✅ Exported ${total} commands to tracker-export.csv`);
  console.log(`📁 Location: ${filePath}`);
  console.log(`💡 Open in Excel or Google Sheets for easy revision!\n`);
}

module.exports = { exportCommand };