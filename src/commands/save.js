/*
 * save.js
 *
 * This file handles the "tracker save" command
 *
 * How it works:
 * User types any command in terminal → shell hook captures it
 * → calls "tracker save <command>" automatically
 * → this file saves it to .tracker/commands.json
 *
 * User never runs this manually — it runs automatically!
 * That's the magic of our tool 
 *
 * Example automatic call:
 * User types "git status"
 * Shell hook runs "tracker save git status" automatically
 */

/*
 * Import saveCommand from storage.js
 * This function already handles:
 * → categorization (uses categorizer.js internally)
 * → duplicate detection
 * → timestamp
 * → writing to commands.json
 * We built all of this on Day 3!
 */
const { saveCommand } = require("../utils/storage");

/*
 * saveCommandAction() — runs when tracker save is called
 *
 * @param {string} command — the command to save
 *                           comes from what user typed in terminal
 *
 * Example:
 * tracker save git status
 * → command = "git status"
 */
function saveCommandAction(command) {

  /*
   * Safety check — if no command provided, exit silently
   * We use "return" to stop the function immediately
   *
   * Why silently?
   * This command runs automatically in background
   * We don't want error messages popping up randomly
   */
  if (!command || !command.trim()) {
    return;
  }

  /*
   * Try-catch — handle errors gracefully
   * If saving fails for any reason — fail silently
   * We never want our tool to interrupt user's workflow
   */
  try {

    /*
     * Call saveCommand from storage.js
     * It returns an object like:
     * { saved: true, category: "git" }
     * { saved: false, reason: "duplicate", category: "git" }
     */
    const result = saveCommand(command);

    /*
     * Only show output if command was actually saved
     * Don't show anything for duplicates — keeps terminal clean
     *
     * result.saved === true → new command, show confirmation
     * result.saved === false → duplicate, stay silent
     */
    if (result.saved) {
      console.log(`✅ Saved [${result.category}]: ${command}`);
    }

  } catch (error) {

    /*
     * If anything goes wrong — fail silently
     * We never want tracker errors to appear during user's work
     */
    return;
  }
}

/*
 * Export saveCommandAction so bin/tracker.js can use it
 */
module.exports = { saveCommandAction };