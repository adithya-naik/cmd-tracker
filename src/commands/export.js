/*
 * export.js
 * Now with proper error handling using validator.js
 */

import fs from "fs";
import path from "path";
import { readCommands } from "../utils/storage.js";
import { isInitialized, showInitError } from "../utils/validator.js";

function exportCommand(options) {

  /*
   * Check initialization first
   */
  if (!isInitialized()) {
    showInitError();
    return;
  }

  try {
    const data = readCommands();

    const total = Object.values(data).reduce(
      (sum, commands) => sum + commands.length, 0
    );

    if (total === 0) {
      console.log("\n📭 No commands to export yet!");
      console.log("💡 Use: tracker save \"your command\"\n");
      return;
    }

    if (options.csv) {
      exportAsCSV(data, total);
    } else {
      exportAsJSON(data, total);
    }

  } catch (error) {
    console.log("\n❌ Error exporting commands");
    console.log("💡 Try running tracker init again\n");
  }
}

function exportAsJSON(data, total) {

  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalCommands: total,
      commands: data
    };

    const filePath = path.join(process.cwd(), "tracker-export.json");
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

    console.log(`\n✅ Exported ${total} commands to tracker-export.json`);
    console.log(`📁 Location: ${filePath}\n`);

  } catch (error) {
    console.log("\n❌ Error creating JSON file");
    console.log("💡 Check if you have write permissions in this folder\n");
  }
}

function exportAsCSV(data, total) {

  try {
    let csvContent = "category,command,date\n";

    for (const [category, commands] of Object.entries(data)) {
      for (const item of commands) {
        const date = new Date(item.time).toLocaleDateString();
        csvContent += `${category},"${item.command}",${date}\n`;
      }
    }

    const filePath = path.join(process.cwd(), "tracker-export.csv");
    fs.writeFileSync(filePath, csvContent);

    console.log(`\n✅ Exported ${total} commands to tracker-export.csv`);
    console.log(`📁 Location: ${filePath}`);
    console.log(`💡 Open in Excel or Google Sheets for easy revision!\n`);

  } catch (error) {
    console.log("\n❌ Error creating CSV file");
    console.log("💡 Check if you have write permissions in this folder\n");
  }
}

export { exportCommand };