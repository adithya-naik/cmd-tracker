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
const {
  isInitialized,
  showInitError,
  isValidQuery
} = require("../utils/validator");
const colors = require("../utils/colors");
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
    console.log(colors.error("\n❌ Please provide a search query"));
    console.log(colors.info('💡 Usage: ') + colors.bold('tracker search "git"') + "\n");
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
      console.log(colors.warning(`\n🔍 No commands found for: "${query}"\n`));
      return;
    }

    console.log(colors.heading(`\n🔍 Search results for: "${query}"`));
    console.log(colors.dim("─".repeat(50)));

    results.forEach((item, index) => {

      const date = new Date(item.time).toLocaleDateString();
      const categoryColor = colors.getCategoryColor(item.category);
      /*
       * Highlight the search term in results
       * Replace matched part with uppercase version
       * So user can easily spot what matched
       */
      const highlighted = item.command.replace(
        new RegExp(searchTerm, "gi"),
        (match) => colors.warning.bold(match)
      );

      console.log(`\n  ${colors.dim(index + 1 + ".")} ${highlighted}`);
      console.log(`     📁 ${categoryColor(item.category)}  ${colors.dim("📅 " + date)}`);
    });

    console.log("\n" + colors.dim("─".repeat(50)));
    console.log(colors.success(`✅ Found ${results.length} matching command(s)\n`));

  } catch (error) {
    console.log(colors.error("\n❌ Error searching commands"));
    console.log(colors.info("💡 Try running tracker init again\n"));
  }
}

module.exports = { searchCommand };