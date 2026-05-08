/*
 * init.js
 *
 * This file handles the "tracker init" command
 * This is the FIRST command a user runs after installing our package
 *
 * What it does:
 * 1. Creates .tracker folder inside user's repo
 * 2. Creates commands.json with empty structure
 * 3. Adds .tracker/ to user's .gitignore automatically
 * 4. Shows clear success/error messages to user
 *
 * User runs: tracker init
 * And everything is set up automatically ✅
 */

/*
 * fs and path — built into Node.js, no need to install
 * fs   → read and write files
 * path → build file paths that work on all operating systems
 */
const fs = require("fs");
const path = require("path");

/*
 * Import initStorage from our storage utility
 * This function already knows how to create .tracker folder
 * and commands.json — we built it on Day 3!
 *
 * This is why we built utilities separately —
 * we can REUSE them anywhere without rewriting code
 */
const { initStorage } = require("../utils/storage");

/*
 * initCommand() — the main function of this file
 *
 * This function runs when user types: tracker init
 * It sets up everything needed to start tracking commands
 */
function initCommand() {

  console.log("🚀 Initializing cmd-tracker in your project...\n");

  /*
   * Try-catch block — handles errors gracefully
   *
   * try  → attempt to run the code
   * catch → if anything goes wrong, handle it nicely
   *         instead of crashing with ugly error messages
   */
  try {

    /*
     * Step 1 — Initialize .tracker folder and commands.json
     * We already built this function in storage.js on Day 3!
     * One line does all the heavy lifting ✅
     */
    initStorage();

    /*
     * Step 2 — Add .tracker/ to user's .gitignore
     * We don't want users accidentally pushing their
     * personal command history to GitHub
     */
    updateGitignore();

    /*
     * Step 3 — Show success message to user
     */
    console.log("\n✅ cmd-tracker initialized successfully!");
    console.log("📁 Created .tracker/commands.json in your project");
    console.log("\n🎯 You can now use:");
    console.log("   tracker list     → see all saved commands");
    console.log("   tracker stats    → see command statistics");
    console.log("   tracker search   → search your commands");
    console.log("\n💡 Start using your terminal normally");
    console.log("   Commands will be saved automatically!\n");

  } catch (error) {

    /*
     * If anything goes wrong — show a helpful error message
     * error.message → gives us what went wrong in plain text
     */
    console.error("❌ Failed to initialize cmd-tracker");
    console.error("Error:", error.message);
    console.error("\n💡 Try running with admin/sudo permissions");
  }
}

/*
 * updateGitignore() — adds .tracker/ to user's .gitignore
 *
 * Why a separate function?
 * → Keeps initCommand() clean and readable
 * → Single responsibility — one function, one job
 * → Easy to test and debug separately
 */
function updateGitignore() {

  /*
   * Build path to .gitignore in user's current directory
   * process.cwd() → where user ran the tracker init command
   */
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  /*
   * The text we want to add to .gitignore
   * \n → new line character
   */
  const trackerEntry = "\n# cmd-tracker personal data\n.tracker/\n";

  /*
   * Check if .gitignore exists in user's repo
   */
  if (fs.existsSync(gitignorePath)) {

    /*
     * Read existing .gitignore content
     */
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

    /*
     * Check if .tracker/ is already in .gitignore
     * No need to add it twice!
     */
    if (gitignoreContent.includes(".tracker/")) {
      console.log("✅ .tracker/ already in .gitignore");
      return;
    }

    /*
     * .tracker/ not found — append it to existing .gitignore
     * appendFileSync → adds to END of file without deleting existing content
     */
    fs.appendFileSync(gitignorePath, trackerEntry);
    console.log("✅ Added .tracker/ to your .gitignore");

  } else {

    /*
     * .gitignore doesn't exist — create a new one
     * with just our .tracker/ entry
     */
    fs.writeFileSync(gitignorePath, trackerEntry);
    console.log("✅ Created .gitignore with .tracker/ entry");
  }
}

/*
 * Export initCommand so bin/tracker.js can use it
 * We only export initCommand — updateGitignore is internal
 * Users of this file only need initCommand
 */
module.exports = { initCommand };