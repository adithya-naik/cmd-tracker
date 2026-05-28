/*
 * hook.js (command)
 *
 * Handles "tracker hook" and "tracker unhook" commands
 *
 * tracker hook   → installs shell hook for auto capture
 * tracker unhook → removes shell hook
 */

const {
  installHook,
  removeHook,
  isHookInstalled,
  detectShell
} = require("../utils/hook");

const { isInitialized, showInitError } = require("../utils/validator");

/*
 * hookCommand() — runs when user types: tracker hook
 * Installs the shell hook for automatic command capture
 */
function hookCommand() {

  /*
   * Must run tracker init before tracker hook
   */
  if (!isInitialized()) {
    showInitError();
    return;
  }

  console.log("\n🪄 Setting up automatic command capture...\n");

  /*
   * Show which shell was detected
   */
  const shell = detectShell();
  console.log(`🔍 Detected shell: ${shell}`);

  /*
   * Check if already installed
   */
  if (isHookInstalled()) {
    console.log("\n⚠️  Shell hook is already installed!");
    console.log("💡 Your commands are already being captured automatically");
    console.log("💡 Run: tracker unhook to disable\n");
    return;
  }

  /*
   * Install the hook
   */
  const result = installHook();
  console.log("\n" + result.message);

  if (result.success) {
    console.log("\n🎯 Almost done! Run this command to activate:");
    /*
     * Always show Unix style path for source command
     * Even on Windows — Git Bash uses Unix paths
     * ~/.bashrc works on all systems
     */
    const sourceCmd = result.shell === "zsh" ? "~/.zshrc" : "~/.bashrc";
    console.log(`\n   source ${sourceCmd}\n`);
    console.log("After that — every command you type will be saved automatically! 🚀\n");
  }
}

/*
 * unhookCommand() — runs when user types: tracker unhook
 * Removes the shell hook
 */
function unhookCommand() {

  console.log("\n🔌 Removing automatic command capture...\n");

  const result = removeHook();
  console.log(result.message);

  if (result.success) {
    console.log("\n🎯 Almost done! Run this to apply changes:");
    const sourceCmd = result.shell === "zsh" ? "~/.zshrc" : "~/.bashrc";
    console.log(`\n   source ${sourceCmd}\n`);
    console.log("After that — automatic capture will be disabled\n");
  }
}

module.exports = { hookCommand, unhookCommand };