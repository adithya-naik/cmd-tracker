/*
 * clear.js
 *
 * Handles "tracker clear" and "tracker clear <category>" commands
 *
 * tracker clear       → clears ALL saved commands
 * tracker clear git   → clears only git commands
 *
 * Always asks for confirmation before clearing
 * So user never accidentally deletes everything
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { readCommands } = require("../utils/storage");

/*
 * Path to commands.json
 * Same as storage.js — where all commands are saved
 */
const COMMANDS_FILE = path.join(process.cwd(), ".tracker", "commands.json");

/*
 * ask() — shows a question and waits for user input
 *
 * readline is built into Node.js
 * It lets us read input from terminal interactively
 *
 * @param {string} question — what to ask user
 * @returns {Promise<string>} — what user typed
 *
 * We use Promise so we can use async/await with it
 */
function ask(question) {
  /*
   * readline.createInterface() sets up input/output
   * process.stdin  → reads from terminal (keyboard)
   * process.stdout → writes to terminal (screen)
   */
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      /*
       * Close readline after getting answer
       * Important — otherwise terminal hangs
       */
      rl.close();
      resolve(answer);
    });
  });
}

/*
 * clearCommand() — main function
 * async because we use await for user confirmation
 *
 * @param {string} category — optional category to clear
 */
async function clearCommand(category) {

  const data = readCommands();

  /*
   * Valid categories
   */
  const validCategories = [
    "git", "npm", "docker", "linux",
    "node", "angular", "python", "others"
  ];

  /*
   * If category provided — validate it
   */
  if (category) {
    const cat = category.toLowerCase();

    if (!validCategories.includes(cat)) {
      console.log(`❌ Unknown category: ${category}`);
      console.log(`📋 Valid categories: ${validCategories.join(", ")}`);
      return;
    }

    /*
     * Check if category has any commands
     */
    if (data[cat].length === 0) {
      console.log(`\n📭 No commands saved in ${cat}\n`);
      return;
    }

    /*
     * Ask for confirmation before clearing
     * await → wait for user to type yes/no
     */
    const answer = await ask(
      `\n⚠️  Clear all ${data[cat].length} ${cat} commands? (yes/no): `
    );

    /*
     * Only proceed if user typed "yes"
     * Anything else → cancel
     */
    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Cancelled\n");
      return;
    }

    /*
     * Clear only that category
     * Set it back to empty array
     */
    data[cat] = [];
    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(data, null, 2));
    console.log(`\n✅ Cleared all ${cat} commands\n`);
    return;
  }

  /*
   * No category → clear EVERYTHING
   * Count total first to show in confirmation
   */
  const total = Object.values(data).reduce(
    (sum, commands) => sum + commands.length, 0
  );

  if (total === 0) {
    console.log("\n📭 No commands saved yet\n");
    return;
  }

  /*
   * Ask for confirmation
   */
  const answer = await ask(
    `\n⚠️  Clear ALL ${total} saved commands? This cannot be undone! (yes/no): `
  );

  if (answer.toLowerCase() !== "yes") {
    console.log("❌ Cancelled\n");
    return;
  }

  /*
   * Reset entire data to empty structure
   */
  const emptyData = {
    git: [], npm: [], docker: [], linux: [],
    node: [], angular: [], python: [], others: []
  };

  fs.writeFileSync(COMMANDS_FILE, JSON.stringify(emptyData, null, 2));
  console.log(`\n✅ Cleared all ${total} saved commands\n`);
}

module.exports = { clearCommand };