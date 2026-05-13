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

const { readCommands } = require("../utils/storage");

/*
 * searchCommand() — main function
 *
 * @param {string} query — what user is searching for
 *                         comes from: tracker search "git status"
 */
function searchCommand(query) {

  /*
   * Safety check — query must be provided
   */
  if (!query || !query.trim()) {
    console.log("❌ Please provide a search query");
    console.log("💡 Usage: tracker search \"git\"");
    return;
  }

  /*
   * Convert to lowercase for case-insensitive search
   * So "Git" and "git" both match "git status"
   */
  const searchTerm = query.trim().toLowerCase();

  /*
   * Read all saved commands
   */
  const data = readCommands();

  /*
   * Store all matching results here
   * Each result will look like:
   * { command: "git status", category: "git", time: "..." }
   */
  const results = [];

  /*
   * Loop through every category and every command
   * Check if command contains the search term
   */
  for (const [category, commands] of Object.entries(data)) {
    for (const item of commands) {

      /*
       * .toLowerCase().includes() → case insensitive search
       * "git status".includes("git") → true
       * "git status".includes("GIT") → false (without toLowerCase)
       * "git status".toLowerCase().includes("git") → true ✅
       */
      if (item.command.toLowerCase().includes(searchTerm)) {
        results.push({
          command: item.command,
          category: category,
          time: item.time
        });
      }
    }
  }

  /*
   * No results found
   */
  if (results.length === 0) {
    console.log(`\n🔍 No commands found for: "${query}"\n`);
    return;
  }

  /*
   * Show results
   */
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
}

module.exports = { searchCommand };