/*
 * search.js
 *
 * Handles "tracker search <query>" command
 *
 * tracker search "git"     → finds all commands containing "git"
 * tracker search "install" → finds all commands containing "install"
 *
 * Searches across ALL categories at once
 * Returns matching commands with their category
 */

import { readCommands } from "../utils/storage.js";
import {
  isInitialized,
  showInitError,
  isValidQuery
} from "../utils/validator.js";

/*
 * searchCommand() — main function
 *
 * @param {string} query — what user is searching for
 *                         comes from: tracker search "git status"
 */
function searchCommand(query) {

  /*
   * Check initialization first
   */
  if (!isInitialized()) {
    showInitError();
    return;
  }

  /*
   * Validate query
   */
  if (!isValidQuery(query)) {
    console.log("\n❌ Please provide a search query");
    console.log("💡 Usage: tracker search \"git\"\n");
    return;
  }

  try {
    const searchTerm = query.trim().toLowerCase();
    const data = readCommands();
    const results = [];

    for (const [category, commands] of Object.entries(data)) {
      for (const item of commands) {
        if (item.command.toLowerCase().includes(searchTerm)) {
          results.push({
            command: item.command,
            category: category,
            time: item.time
          });
        }
      }
    }

    if (results.length === 0) {
      console.log(`\n🔍 No commands found for: "${query}"\n`);
      return;
    }

    console.log(`\n🔍 Search results for: "${query}"`);
    console.log("─".repeat(50));

  results.forEach((item, index) => {

    const date = new Date(item.time).toLocaleDateString();

    /*
     * Highlight the search term in results
     * Replace matched part with uppercase version
     * So user can easily spot what matched
     */
    const highlighted = item.command.replace(
      new RegExp(searchTerm, "gi"),
      (match) => `[${match.toUpperCase()}]`
    );

    console.log(`\n  ${index + 1}. ${highlighted}`);
    console.log(`     📁 Category: ${item.category}  📅 ${date}`);
  });

    console.log("\n" + "─".repeat(50));
    console.log(`✅ Found ${results.length} matching command(s)\n`);

  } catch (error) {
    console.log("\n❌ Error searching commands");
    console.log("💡 Try running tracker init again\n");
  }
}

export { searchCommand };
