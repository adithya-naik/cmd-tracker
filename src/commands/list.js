/*
 * list.js
 *
 * Handles "tracker list" and "tracker list <category>" commands
 *
 * tracker list         → shows ALL saved commands
 * tracker list git     → shows only git commands
 * tracker list npm     → shows only npm commands
 */

const { readCommands } = require("../utils/storage");

/*
 * listCommand() — main function
 *
 * @param {string} category — optional, filters by category
 *                            comes from user typing: tracker list git
 */
function listCommand(category) {

  /*
   * Read all commands from .tracker/commands.json
   * Returns object with all categories
   */
  const data = readCommands();

  /*
   * Valid categories our tool supports
   * Used to validate if user typed correct category
   */
  const validCategories = [
    "git", "npm", "docker", "linux",
    "node", "angular", "python", "others"
  ];

  /*
   * If user provided a category — validate it first
   * tracker list git → valid ✅
   * tracker list xyz → invalid ❌
   */
  if (category) {

    /*
     * .toLowerCase() → so "Git" and "git" both work
     */
    const cat = category.toLowerCase();

    if (!validCategories.includes(cat)) {
      console.log(`❌ Unknown category: ${category}`);
      console.log(`📋 Valid categories: ${validCategories.join(", ")}`);
      return;
    }

    /*
     * Show commands for that specific category only
     */
    displayCategory(cat, data[cat]);
    return;
  }

  /*
   * No category provided → show ALL commands
   *
   * Track total commands across all categories
   */
  let totalCommands = 0;

  console.log("\n📟 CMD-TRACKER — Your Command History\n");
  console.log("─".repeat(50));

  /*
   * Loop through each category and display its commands
   * Object.entries() → [["git", [...]], ["npm", [...]], ...]
   */
  for (const [cat, commands] of Object.entries(data)) {

    /*
     * Skip empty categories — no point showing empty lists
     */
    if (commands.length === 0) continue;

    displayCategory(cat, commands);
    totalCommands += commands.length;
  }

  /*
   * If no commands saved at all — show helpful message
   */
  if (totalCommands === 0) {
    console.log("\n📭 No commands saved yet!");
    console.log("💡 Use: tracker save \"your command\"");
    console.log("💡 Or run: tracker init first\n");
    return;
  }

  console.log("─".repeat(50));
  console.log(`\n✅ Total: ${totalCommands} commands saved\n`);
}

/*
 * displayCategory() — displays commands of one category
 * Separated into its own function to keep code clean
 * We call it for each category in the loop above
 *
 * @param {string} categoryName — e.g "git"
 * @param {array}  commands     — array of command objects
 */
function displayCategory(categoryName, commands) {

  /*
   * Category icons — makes output look clean and readable
   * Each category gets its own emoji
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

  const icon = icons[categoryName] || "📌";

  console.log(`\n${icon}  ${categoryName.toUpperCase()} (${commands.length})`);
  console.log("─".repeat(30));

  /*
   * Loop through each command in this category
   * command object looks like:
   * { command: "git status", time: "2026-05-08T..." }
   */
  commands.forEach((item, index) => {

    /*
     * Format the date nicely
     * new Date(item.time) → converts ISO string to Date object
     * .toLocaleDateString() → "5/8/2026"
     */
    const date = new Date(item.time).toLocaleDateString();

    /*
     * index + 1 → so list starts from 1 not 0
     * padStart(2) → keeps numbers aligned: " 1", " 2", "10"
     */
    console.log(`  ${String(index + 1).padStart(2, " ")}. ${item.command}  (${date})`);
  });
}

module.exports = { listCommand };