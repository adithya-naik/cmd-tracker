/*
 * stats.js
 *
 * Handles "tracker stats" command
 *
 * Shows a breakdown of saved commands:
 * → Total commands saved
 * → Count per category
 * → Percentage per category
 * → Most used category
 */

const { readCommands } = require("../utils/storage");
const { isInitialized, showInitError } = require("../utils/validator");

function statsCommand() {

  if (!isInitialized()) {
    showInitError();
    return;
  }

  try {
    const data = readCommands();

  /*
   * Calculate total commands across all categories
   * Object.values() → gets all arrays from data object
   * .reduce() → adds up all lengths
   *
   * Example:
   * { git: [1,2], npm: [1] } 
   * → values → [[1,2], [1]]
   * → reduce → 2 + 1 = 3
   */
  const total = Object.values(data).reduce(
    (sum, commands) => sum + commands.length, 0
  );

    if (total === 0) {
      console.log("\n📭 No commands saved yet!");
      console.log("💡 Use: tracker save \"your command\"\n");
      return;
    }

    console.log("\n📊 CMD-TRACKER — Statistics\n");
    console.log("─".repeat(50));

  /*
   * Category icons — same as list.js for consistency
   */
  const icons = {
    git:     "🔀",
    npm:     "📦",
    docker:  "🐳",
    linux:   "🐧",
    node:    "🟢",
    angular: "🔴",
    python:  "🐍",
    others:  "📌"
  };

  /*
   * Track which category has most commands
   */
  let topCategory = "";
  let topCount = 0;

  /*
   * Loop through each category and show stats
   */
  for (const [category, commands] of Object.entries(data)) {

    /*
     * Skip empty categories
     */
    if (commands.length === 0) continue;

    /*
     * Calculate percentage
     * Math.round() → rounds to nearest whole number
     * 2.7 → 3, 2.3 → 2
     */
    const percentage = Math.round((commands.length / total) * 100);

    /*
     * Build a simple visual bar
     * "█".repeat(percentage/5) → each block = 5%
     * So 50% → 10 blocks, 100% → 20 blocks
     */
    const bar = "█".repeat(Math.round(percentage / 5));

    const icon = icons[category] || "📌";

    console.log(
      `\n${icon}  ${category.toUpperCase().padEnd(10)} ` +
      `${String(commands.length).padStart(3)} commands  ` +
      `${String(percentage).padStart(3)}%  ${bar}`
    );

    /*
     * Track top category
     */
    if (commands.length > topCount) {
      topCount = commands.length;
      topCategory = category;
    }
  }

    console.log("\n" + "─".repeat(50));
    console.log(`📦 Total commands : ${total}`);
    console.log(`🏆 Most used      : ${topCategory} (${topCount} commands)\n`);

  } catch (error) {
    console.log("\n❌ Error reading statistics");
    console.log("💡 Try running tracker init again\n");
  }
}

module.exports = { statsCommand };